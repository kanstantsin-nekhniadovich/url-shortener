import 'dotenv/config';
import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

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

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
