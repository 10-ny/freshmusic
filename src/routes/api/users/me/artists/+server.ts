import { json, error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { follows } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

function requireAuth(locals: App.Locals) {
	if (!locals.userId) error(401, 'Not signed in');
	return locals.userId;
}

export const GET: RequestHandler = async ({ locals }) => {
	const userId = requireAuth(locals);
	const rows = await getDb()
		.select({ artistName: follows.artistName })
		.from(follows)
		.where(eq(follows.userId, userId));

	return json({ artists: rows.map((r) => r.artistName) });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const userId = requireAuth(locals);
	const body = await request.json().catch(() => null);
	const artists: unknown = body?.artists;

	if (!Array.isArray(artists) || (artists as unknown[]).some((a) => typeof a !== 'string')) {
		error(400, 'artists must be an array of strings');
	}

	const db = getDb();
	await db.delete(follows).where(eq(follows.userId, userId));

	if (artists.length > 0) {
		await db.insert(follows).values(
			(artists as string[]).map((artistName) => ({ userId, artistName }))
		);
	}

	return json({ ok: true });
};
