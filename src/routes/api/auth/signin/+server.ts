import { json, error } from '@sveltejs/kit';
import { compare } from 'bcryptjs';
import { getDb } from '#lib/server/db';
import { users, sessions } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const SESSION_COOKIE = 'rotation-session';
const SESSION_DAYS = 30;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	const username = typeof body?.username === 'string' ? body.username.trim() : '';
	const password = typeof body?.password === 'string' ? body.password : '';

	if (!username || !password) error(400, 'username and password are required');

	const db = getDb();
	const rows = await db
		.select({ id: users.id, username: users.username, passwordHash: users.passwordHash })
		.from(users)
		.where(eq(users.username, username))
		.limit(1);

	// Same error for unknown user and wrong password to avoid username enumeration
	const user = rows[0];
	const valid = user ? await compare(password, user.passwordHash) : false;
	if (!valid) error(401, 'Invalid username or password');

	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
	await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt });

	cookies.set(SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		expires: expiresAt,
	});

	return json({ id: user.id, username: user.username });
};
