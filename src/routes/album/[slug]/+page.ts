import { albums } from '#lib/data/albums';
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const album = albums.find((a) => a.slug === params.slug);
  if (!album) error(404, 'Album not found');
  const index = albums.indexOf(album);
  return { album, index, total: albums.length };
}
