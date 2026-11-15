import { json, error } from '@sveltejs/kit';
import { hash } from 'bcryptjs';
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

	if (!username) error(400, 'username is required');
	if (!password)  error(400, 'password is required');

	const db = getDb();
	const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
	if (existing.length > 0) error(409, 'username already taken');

	const id = crypto.randomUUID();
	const passwordHash = await hash(password, 12);
	await db.insert(users).values({ id, username, passwordHash });

	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
	await db.insert(sessions).values({ id: sessionId, userId: id, expiresAt });

	cookies.set(SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		expires: expiresAt,
	});

	return json({ id, username, isNew: true });
};
