import { json, error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { follows } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import { getArtistLatestRelease } from '#lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.userId) error(401, 'Not signed in');

	const db = getDb();
	const rows = await db
		.select({ artistName: follows.artistName, spotifyId: follows.spotifyId })
		.from(follows)
		.where(eq(follows.userId, locals.userId));

	// Only fetch for artists that have a Spotify ID stored
	const withSpotify = rows.filter((r) => r.spotifyId);

	const releases = await Promise.all(
		withSpotify.map((r) => getArtistLatestRelease(r.spotifyId!))
	);

	const albums = releases
		.filter((a): a is NonNullable<typeof a> => a !== null)
		.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

	return json(albums);
};
