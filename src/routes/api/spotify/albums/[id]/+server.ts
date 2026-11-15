import { json, error } from '@sveltejs/kit';
import { getAlbum } from '#lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const result = await getAlbum(params.id);
	if (!result) error(404, 'Album not found');
	return json(result);
};
