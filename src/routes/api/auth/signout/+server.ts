import { json } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { sessions } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const SESSION_COOKIE = 'rotation-session';

export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get(SESSION_COOKIE);
	if (sessionId) {
		await getDb().delete(sessions).where(eq(sessions.id, sessionId));
	}
	cookies.delete(SESSION_COOKIE, { path: '/' });
	return json({ ok: true });
};
