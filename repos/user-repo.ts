import { db } from "../db/db";
import type { users_table } from "../sqlite-table-defs";

export const userRepository = {
    selectUserById: db.prepare<users_table, [number]>("SELECT * FROM users WHERE id = $1"),
    selectUserByEmail: db.prepare<users_table, [string]>("SELECT * FROM users WHERE email = $1"),
    insertUser: db.prepare<users_table, [string]>("INSERT INTO users (email) VALUES ($1) RETURNING *"),
    insertUserAuthDetails: db.prepare<users_table, [number, string, string, number]>(
        "INSERT INTO user_auth_details (user_id, hash, salt, iterations) VALUES ($1, $2, $3, $4)"
    )
}