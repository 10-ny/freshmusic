import { getAlbum } from '#lib/server/spotify';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const result = await getAlbum(params.slug);
  if (!result) error(404, 'Album not found');
  return { album: result.album, tracks: result.tracks };
};
