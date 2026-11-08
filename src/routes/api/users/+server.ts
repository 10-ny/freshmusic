import { json, error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db';
import { users } from '#lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id.trim() : '';

  if (!id) {
    error(400, 'id is required');
  }

  const db = getDb();
  const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({ id });
    return json({ id, isNew: true });
  }

  return json({ id, isNew: false });
};
