// src/scripts/seed.ts
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';

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

  const allowedDeviceTypes = ['desktop', 'mobile', 'bot'] as const;
  const countries = ['US', 'PL', 'DE', 'GB', 'IN', 'CA'] as const;
  const refererHosts = [
    'google.com',
    'news.ycombinator.com',
    'github.com',
    'linkedin.com',
    'newsletter.example',
  ] as const;
  const usersToSeed = [
    { name: 'Alice Nguyen', email: 'alice@example.com' },
    { name: 'Bartosz Kowalski', email: 'bartosz@example.com' },
    { name: 'Chloe Martin', email: 'chloe@example.com' },
    { name: 'Daniel Schmidt', email: 'daniel@example.com' },
    { name: 'Elena Petrova', email: 'elena@example.com' },
    { name: 'Farah Khan', email: 'farah@example.com' },
    { name: 'Gabriel Silva', email: 'gabriel@example.com' },
    { name: 'Hana Novak', email: 'hana@example.com' },
    { name: 'Ivan Horvat', email: 'ivan@example.com' },
    { name: 'Julia Rossi', email: 'julia@example.com' },
  ];

  const tagNames = [
    'marketing',
    'internal',
    'docs',
    'social',
    'campaign',
    'product',
    'blog',
    'email',
    'partner',
    'promo',
    'seo',
    'support',
  ] as const;

  const urlCountsPerUser = [8, 7, 6, 5, 4, 3, 3, 2, 1, 1] as const;

  const hashes = Array.from(
    { length: 40 },
    (_, i) => `u${(i + 1).toString(36).padStart(6, '0')}`,
  );

  await db.transaction(async (tx) => {
    await tx.delete(schema.redirectEventTable);
    await tx.delete(schema.urlTagTable);
    await tx.delete(schema.urlTable);
    await tx.delete(schema.tagTable);
    await tx.delete(schema.userTable);

    const users = await tx
      .insert(schema.userTable)
      .values(usersToSeed)
      .returning({ id: schema.userTable.id });

    await tx.insert(schema.tagTable).values(
      tagNames.map((name, index) => ({
        name,
        description: `${name} URLs for reporting practice`,
        created_at: new Date(Date.UTC(2026, 0, index + 1, 10, 0, 0)),
      })),
    );

    const urlOwnerIds = urlCountsPerUser.flatMap((count, userIndex) =>
      Array.from({ length: count }, () => users[userIndex].id),
    );

    const urls = await tx
      .insert(schema.urlTable)
      .values(
        hashes.map((hash, index) => ({
          hash,
          original_url: `https://example.com/articles/${index + 1}`,
          created_at: new Date(Date.UTC(2026, 0, (index % 28) + 1, 9, 0, 0)),
          user_id: urlOwnerIds[index],
        })),
      )
      .returning({ hash: schema.urlTable.hash });

    const urlTags = urls.flatMap((url, index) => {
      const tagCount = index % 4;

      return Array.from({ length: tagCount }, (_, tagOffset) => ({
        url_hash: url.hash,
        tag_name: tagNames[(index * 3 + tagOffset) % tagNames.length],
      }));
    });

    if (urlTags.length > 0) {
      await tx.insert(schema.urlTagTable).values(urlTags);
    }

    const activeUrls = urls.slice(0, urls.length - 5);
    const now = new Date();

    const redirectEvents = Array.from({ length: 5000 }, (_, index) => {
      const trafficBucket = index % 10;
      const urlIndex =
        trafficBucket < 4
          ? index % 5
          : trafficBucket < 7
            ? (index * 3) % 15
            : (index * 7) % activeUrls.length;
      const url = activeUrls[urlIndex];
      const deviceType =
        allowedDeviceTypes[(index * 5) % allowedDeviceTypes.length];
      const visitedAt = new Date(
        now.getTime() -
          (index % 30) * 24 * 60 * 60 * 1000 -
          ((index * 13) % 24) * 60 * 60 * 1000 -
          ((index * 17) % 60) * 60 * 1000,
      );

      return {
        url_hash: url.hash,
        visited_at: visitedAt,
        visitor_country: countries[(index * 7) % countries.length],
        referer_host:
          index % 6 === 0
            ? null
            : refererHosts[(index * 11) % refererHosts.length],
        device_type: deviceType,
        response_ms:
          40 + ((index * 23) % 900) + (deviceType === 'bot' ? 120 : 0),
      };
    });

    await tx.insert(schema.redirectEventTable).values(redirectEvents);
  });

  console.log('seed applied');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
