import { db } from "./db/db";
import { userRepository } from "./repos/user-repo";
import type { user_auth_details_table, user_sessions_table } from "./sqlite-table-defs";

const ITERATIONS = 200_000;
const SALT_LEN = 16;
const HASH_LEN = 32;
export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
const LOCK_THRESHOLD = 5;
const LOCK_SECONDS = 900;

const enc = new TextEncoder();
const dec = new TextDecoder();

export async function registerUser(email: string, password: string) {
    const salt = randBytes(SALT_LEN);
    const hash = await pbkdf2(password, salt);

    try {
        const newUser = userRepository.insertUser.get(email)
        userRepository.insertUserAuthDetails.run(newUser?.id!, b64url(hash), b64url(salt), ITERATIONS)
        return true;
    } catch {
        return false;
    }
}

const selectUserAuthDetailsByUserId = db.prepare<user_auth_details_table, [number]>("SELECT * FROM user_auth_details WHERE user_id = $1")
const resetAuthLockById = db.prepare<null, [number]>("UPDATE user_auth_details SET failed_attempts=0, lock_until=0 WHERE id=$1")
const addFailedAuthAttempt = db.prepare<null, [number, number, number]>("UPDATE user_auth_details SET failed_attempts=$1, lock_until=$2 WHERE id=$3")
export async function verifyUserEmailAndPassword(email: string, password: string): Promise<{ ok: boolean, id?: number, reason?: string }> {
    const user = userRepository.selectUserByEmail.get(email)
    if (!user) return { ok: false }
    const row = selectUserAuthDetailsByUserId.get(user.id);
    if (!row) return { ok: false };

    const { id, hash, salt, iterations, failed_attempts, lock_until } = row;
    if (lock_until && nowSec() < lock_until) return { ok: false, reason: "locked" };
    const calc = await pbkdf2(password, b64urlDec(salt), iterations);
    const match = safeEq(calc, b64urlDec(hash));
    if (match) {
        resetAuthLockById.run(id)
        return { ok: true, id };
    } else {
        const nf = (failed_attempts ?? 0) + 1;
        const nl = nf >= LOCK_THRESHOLD ? nowSec() + LOCK_SECONDS : 0;
        addFailedAuthAttempt.run(nf, nl, id)
        return { ok: false };
    }
}

const createUserSessionByUserId = db.prepare<null, [string, number, number]>(
    "INSERT INTO user_sessions (token,user_id,expires) VALUES ($1,$2,$3)"
)
export function newSession(userId: number) {
    const token = b64url(randBytes(32));
    const expires = nowSec() + SESSION_TTL;
    createUserSessionByUserId.run(token, userId, expires)
    return { token, expires };
}

const getUserSessionByToken = db.prepare<user_sessions_table, [string]>("SELECT * FROM user_sessions WHERE token=$1")
export function getSession(token: string): { user_id: number, expires: number } | null {
    const row = getUserSessionByToken.get(token);
    if (!row) return null;
    const { user_id, expires } = row;
    if (nowSec() > expires) {
        delSession(token)
        return null;
    }
    return { user_id, expires };
}

const deleteUserSessionByToken = db.prepare<null, [string]>("DELETE FROM user_sessions WHERE token=$1")
export function delSession(token: string) {
    deleteUserSessionByToken.run(token)
}

function nowSec() {
    return Math.floor(Date.now() / 1000);
}

function randBytes(n: number) {
    return crypto.getRandomValues(new Uint8Array(n));
}

function b64url(buf: Uint8Array) {
    let s = btoa(String.fromCharCode(...buf));
    return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDec(s: string) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bin = atob(s);
    return new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
}

// https://datatracker.ietf.org/doc/html/rfc8018
async function pbkdf2(pass: string, salt: Uint8Array, iters = ITERATIONS) {
    const key = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
    const buf = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iters }, key, HASH_LEN * 8);
    return new Uint8Array(buf);
}

function safeEq(a: Uint8Array, b: Uint8Array) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => x === b[i]);
}
