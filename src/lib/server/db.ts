import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from '$app/env/private';

export function getDb() {
  return drizzle(neon(DATABASE_URL));
}
