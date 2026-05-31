import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
});

export const urlTable = pgTable('url', {
  hash: varchar().primaryKey(),
  originalUrl: varchar().notNull(),
  createdAt: timestamp().defaultNow(),
  userId: uuid().references(() => userTable.id),
});
