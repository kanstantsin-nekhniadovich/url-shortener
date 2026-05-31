// src/scripts/migrate.ts
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

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

async function main() {
  const db = drizzle(getDatabaseUrl());
  await migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });
  console.log('Migrations applied');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
