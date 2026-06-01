import { Inject, Injectable } from '@nestjs/common';
import type { DB } from '../db/client';
import { InjectDb } from '../db/db.provider';
import { urlTable } from '../db/schema';
import { UrlData } from 'src/types/url.types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { eq } from 'drizzle-orm';
import { Logger } from '@nestjs/common';

@Injectable()
export class UrlRepository {
  private readonly logger = new Logger(UrlRepository.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectDb() private readonly db: DB,
  ) {}

  async getUrlByHash(hash: string): Promise<UrlData | null> {
    const cachedData = await this.cache.get<UrlData>(hash);

    if (cachedData) {
      this.logger.log(`Hit redis cache: ${hash}`);
      return cachedData;
    }

    const [urlData] = await this.db
      .select()
      .from(urlTable)
      .where(eq(urlTable.hash, hash));

    if (!urlData) {
      return null;
    }

    await this.cache.set(hash, urlData);
    this.logger.log(`Stored to redis cache: ${hash}`);

    return urlData;
  }

  async saveUrl({
    url,
    hash,
    userId,
  }: {
    url: string;
    hash: string;
    userId: string;
  }) {
    const [urlData] = await this.db
      .insert(urlTable)
      .values({
        hash,
        originalUrl: url,
        userId,
      })
      .returning();

    await this.cache.set(hash, urlData);

    return urlData;
  }
}
