import 'dotenv/config';
import { existsSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';

function getDatabaseUrl(): string {
  const databaseUrl = process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error('POSTGRES_URL is not set');
  }

  const resolvedUrl = new URL(databaseUrl);

  if (!existsSync('/.dockerenv') && resolvedUrl.hostname === 'postgres') {
    resolvedUrl.hostname = 'localhost';
  }

  return resolvedUrl.toString();
}

const db = drizzle(getDatabaseUrl());

export type DB = typeof db;

export default db;
