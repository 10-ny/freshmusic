import { json, error } from '@sveltejs/kit';
import { searchArtists } from '#lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	if (q.length < 2) error(400, 'Query must be at least 2 characters');

	const artists = await searchArtists(q);
	return json(artists);
};
