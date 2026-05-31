import { Injectable } from '@nestjs/common';
import type { DB } from '../../db/client';
import { InjectDb } from '../../db/db.provider';
import { urlTable } from '../../db/schema';
import { UrlData } from 'src/types/url.types';
import { eq } from 'drizzle-orm';

@Injectable()
export class UrlRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async getUrlByHash(hash: string): Promise<UrlData> {
    const [urlData] = await this.db
      .select()
      .from(urlTable)
      .where(eq(urlTable.hash, hash));

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

    return urlData;
  }
}
