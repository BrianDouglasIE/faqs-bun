import { Project } from "./models/project";
import { db } from "./db/db";
import type { projects_table } from "./sqlite-table-defs";

import { Hono } from 'hono'
import { delSession, getSession, newSession, registerUser, SESSION_TTL, verifyUserEmailAndPassword } from "./auth";
import { userRepository } from "./repos/user-repo";

import { registerViewDir, registerIncludeDir, view, create } from '@briandouglasie/literal-templates'

await registerViewDir('./views', false)
await registerIncludeDir('./views/includes')

const projects = new Hono().basePath('/projects')
projects.get('/', (c) => {
    const rawProjects = db.query<projects_table, []>('SELECT * FROM projects LIMIT 10;').all()
    const projects = rawProjects.map(it => new Project(it.id, it.name, new Date(it.created_at)))
    return c.json(projects)
})

const app = new Hono()
app.route('/', projects)
app.get('/', (c) => c.html(view('guest', { $content: view('index') })))

app.get("/register", (c) => c.html(view('guest', { $content: view('register') })))
app.post("/register", async (c) => {
    const formData = await c.req.formData();
    const password = formData.get('password')?.toString()
    const confirm_password = formData.get('confirm_password')?.toString()
    const email = formData.get('email')?.toString()
    if (!email || !password || password.length < 8 || confirm_password != password) return c.json({ error: "invalid" }, 400);
    const ok = await registerUser(email.toLowerCase(), password);
    return ok ? c.json({ ok: true }) : c.json({ error: "exists" }, 409);
});

app.get("/login", (c) => c.html(view('guest', { $content: view('login') })))
app.post("/login", async (c) => {
    const formData = await c.req.formData();
    const password = formData.get('password')?.toString()
    const email = formData.get('email')?.toString()
    if (!email || !password) return c.json({ error: "invalid" }, 401);
    const r = await verifyUserEmailAndPassword(email.toLowerCase(), password);
    if (!r.ok || !r.id) return c.json({ error: r.reason ?? "invalid" }, 401);

    const sess = newSession(r.id);
    c.header("set-cookie", `sid=${sess.token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL}`);
    return c.json({ ok: true });
});

app.post("/logout", (c) => {
    const cookie = c.req.header("cookie") ?? "";
    const sid = cookie.split(";").find((x) => x.trim().startsWith("sid="))?.split("=")[1];
    if (sid) delSession(sid);
    c.header("set-cookie", "sid=; Max-Age=0; Path=/");
    return c.json({ ok: true });
});

app.get("/profile", (c) => {
    const cookie = c.req.header("cookie") ?? "";
    const sid = cookie.split(";").find((x) => x.trim().startsWith("sid="))?.split("=")[1];
    if (!sid) return c.json({ error: "unauth" }, 401);
    const sess = getSession(sid);
    if (!sess) return c.json({ error: "unauth" }, 401);
    const row = userRepository.selectUserById.get(sess.user_id);
    if (!row) return c.json({ error: "notfound" }, 404);
    const { id, email } = row;
    return c.json({ id, email });
});

export default app