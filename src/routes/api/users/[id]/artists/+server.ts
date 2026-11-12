import { json, error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { users, follows } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const db = getDb();
  const rows = await db
    .select({ artistName: follows.artistName })
    .from(follows)
    .where(eq(follows.userId, params.id));

  return json({ artists: rows.map((r: { artistName: string }) => r.artistName) });
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const body = await request.json().catch(() => null);
  const artists: unknown = body?.artists;

  if (!Array.isArray(artists) || (artists as unknown[]).some((a) => typeof a !== 'string')) {
    error(400, 'artists must be an array of strings');
  }

  const db = getDb();
  const userExists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);

  if (userExists.length === 0) {
    error(404, 'user not found');
  }

  await db.delete(follows).where(eq(follows.userId, params.id));

  if (artists.length > 0) {
    await db.insert(follows).values(
      (artists as string[]).map((artistName) => ({ userId: params.id, artistName }))
    );
  }

  return json({ ok: true });
};
