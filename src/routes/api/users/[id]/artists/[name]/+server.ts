import { json, error } from '@sveltejs/kit';
import { db } from '#lib/server/db';
import { follows } from '#lib/server/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
  const result = await db
    .delete(follows)
    .where(and(eq(follows.userId, params.id), eq(follows.artistName, params.name)));

  return json({ ok: true });
};
