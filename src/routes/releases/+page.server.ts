import { getDb } from '#lib/server/db';
import { follows } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import { getArtistLatestRelease } from '#lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.userId) return { albums: [] };

	const rows = await getDb()
		.select({ artistName: follows.artistName, spotifyId: follows.spotifyId })
		.from(follows)
		.where(eq(follows.userId, locals.userId));

	const withSpotify = rows.filter((r) => r.spotifyId);

	const releases = await Promise.all(
		withSpotify.map((r) => getArtistLatestRelease(r.spotifyId!))
	);

	const albums = releases
		.filter((a): a is NonNullable<typeof a> => a !== null)
		.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

	return { albums };
};
