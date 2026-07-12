import { sql } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  primaryKey,
  check,
  index,
} from 'drizzle-orm/pg-core';

export const deviceTypeEnum = pgEnum('device_type', [
  'desktop',
  'mobile',
  'bot',
]);

export const userTable = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
});

export const urlTable = pgTable(
  'url',
  {
    hash: varchar().primaryKey(),
    original_url: varchar().notNull(),
    created_at: timestamp().defaultNow(),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id),
  },
  (table) => [index('url_user_id').on(table.user_id)],
);

export const redirectEventTable = pgTable(
  'redirect_event',
  {
    id: uuid().primaryKey().defaultRandom(),
    url_hash: varchar()
      .notNull()
      .references(() => urlTable.hash),
    visited_at: timestamp().notNull().defaultNow(),
    visitor_country: varchar({ length: 2 }).notNull(),
    referer_host: varchar(),
    device_type: deviceTypeEnum().notNull(),
    response_ms: integer().notNull(),
  },
  (table) => [
    check('response_ms is non-negative', sql`${table.response_ms} > 0`),
    index('url_hash').on(table.url_hash),
    index('visited_at').on(table.visited_at),
    index('url_hash_visited_at').on(table.url_hash, table.visited_at.desc()),
  ],
);

export const tagTable = pgTable('tag', {
  name: varchar().primaryKey(),
  description: varchar(),
  created_at: timestamp().notNull().defaultNow(),
});

export const urlTagTable = pgTable(
  'url_tag',
  {
    url_hash: varchar()
      .notNull()
      .references(() => urlTable.hash, { onDelete: 'cascade' }),
    tag_name: varchar()
      .notNull()
      .references(() => tagTable.name, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.url_hash, table.tag_name] })],
);
