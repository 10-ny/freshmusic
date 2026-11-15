import { json, error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { follows } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

type ArtistEntry = { name: string; spotifyId?: string | null };

function requireAuth(locals: App.Locals) {
	if (!locals.userId) error(401, 'Not signed in');
	return locals.userId;
}

export const GET: RequestHandler = async ({ locals }) => {
	const userId = requireAuth(locals);
	const rows = await getDb()
		.select({ artistName: follows.artistName, spotifyId: follows.spotifyId })
		.from(follows)
		.where(eq(follows.userId, userId));

	return json({ artists: rows.map((r) => ({ name: r.artistName, spotifyId: r.spotifyId })) });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const userId = requireAuth(locals);
	const body = await request.json().catch(() => null);
	const artists: unknown = body?.artists;

	if (!Array.isArray(artists)) error(400, 'artists must be an array');

	const entries = artists as ArtistEntry[];
	if (entries.some((a) => typeof a?.name !== 'string')) {
		error(400, 'each artist must have a name');
	}

	const db = getDb();
	await db.delete(follows).where(eq(follows.userId, userId));

	if (entries.length > 0) {
		await db.insert(follows).values(
			entries.map(({ name, spotifyId }) => ({
				userId,
				artistName: name,
				spotifyId: spotifyId ?? null,
			}))
		);
	}

	return json({ ok: true });
};
