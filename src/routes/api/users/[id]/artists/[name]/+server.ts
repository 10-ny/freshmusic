import { json, error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { follows } from '#lib/server/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.userId) error(401, 'Not signed in');

	const db = getDb();
	await db
		.delete(follows)
		.where(and(eq(follows.userId, locals.userId), eq(follows.artistName, params.name)));

	return json({ ok: true });
};
