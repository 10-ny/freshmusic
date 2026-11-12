import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const follows = pgTable(
  'follows',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    artistName: text('artist_name').notNull(),
    followedAt: timestamp('followed_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.artistName] })]
);
