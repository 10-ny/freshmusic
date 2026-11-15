import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:           text('id').primaryKey(),             // crypto.randomUUID()
  username:     text('username').notNull().unique(),  // word-pair e.g. 'river-desk'
  passwordHash: text('password_hash').notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id:        text('id').primaryKey(),                // crypto.randomUUID()
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const follows = pgTable(
  'follows',
  {
    userId:     text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    artistName: text('artist_name').notNull(),
    followedAt: timestamp('followed_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.artistName] })]
);
