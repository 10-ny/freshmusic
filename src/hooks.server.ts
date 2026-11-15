import type { Handle } from '@sveltejs/kit/hooks';
import { getDb } from '#lib/server/db';
import { sessions } from '#lib/server/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.userId = null;

	const sessionId = event.cookies.get('rotation-session');
	if (sessionId) {
		const rows = await getDb()
			.select({ userId: sessions.userId })
			.from(sessions)
			.where(eq(sessions.id, sessionId))
			.limit(1);

		if (rows.length > 0) {
			event.locals.userId = rows[0].userId;
		}
	}

	return resolve(event);
};
