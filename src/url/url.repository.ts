import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DB } from '../db/client';
import { InjectDb } from '../db/db.provider';
import {
  urlTable,
  userTable,
  redirectEventTable,
  urlTagTable,
} from '../db/schema';
import {
  GetUrlMetadataOptions,
  PaginatedUrlMetadata,
  UrlData,
} from 'src/types/url.types';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { asc, count, desc, eq, max, sql, gte, gt, avg } from 'drizzle-orm';
import { Logger } from '@nestjs/common';

@Injectable()
export class UrlRepository {
  private readonly logger = new Logger(UrlRepository.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectDb() private readonly db: DB,
  ) {}

  async getUrlByHash(hash: string): Promise<UrlData | null> {
    // const cachedData = await this.cache.get<UrlData>(hash);

    // if (cachedData) {
    //   this.logger.log(`Hit redis cache: ${hash}`);
    //   return cachedData;
    // }

    const [urlData] = await this.db
      .select({
        hash: urlTable.hash,
        originalUrl: urlTable.original_url,
        createdAt: urlTable.created_at,
        userId: urlTable.user_id,
      })
      .from(urlTable)
      .where(eq(urlTable.hash, hash));

    if (!urlData) {
      throw new NotFoundException();
    }

    // await this.cache.set(hash, urlData);
    this.logger.log(`Stored to redis cache: ${hash}`);

    return urlData;
  }

  async getUrlMetadata({
    userId,
    page,
    pageSize,
    sortBy,
    sortOrder,
  }: GetUrlMetadataOptions): Promise<PaginatedUrlMetadata> {
    const offset = (page - 1) * pageSize;

    // SELECT
    //     u.hash,
    //     u.original_url,
    //     us.name,
    //     us.email,
    //     COALESCE(tag_stats.number_of_tags, 0) AS number_of_tags,
    //     COALESCE(redirect_stats.number_of_redirects, 0) AS number_of_redirects,
    //     redirect_stats.latest_redirect_timestamp
    // FROM url u
    // JOIN public.user us ON us.id = u.user_id
    // LEFT JOIN (SELECT ut.url_hash, COUNT(*) AS number_of_tags FROM url_tag ut GROUP BY ut.url_hash) AS tag_stats
    // ON tag_stats.url_hash = u.hash
    // LEFT JOIN (
    //   SELECT re.url_hash, COUNT(*) AS number_of_redirects, MAX(re.visited_at) AS latest_redirect_timestamp FROM redirect_event re
    //   GROUP BY re.url_hash
    // ) AS redirect_stats ON redirect_stats.url_hash = u.hash
    // ORDER BY number_of_redirects DESC, u.hash;

    const tagStats = this.db
      .select({
        urlHash: urlTagTable.url_hash,
        numberOfTags: count(urlTagTable.tag_name).as('number_of_tags'),
      })
      .from(urlTagTable)
      .groupBy(urlTagTable.url_hash)
      .as('tag_stats');

    const redirectStats = this.db
      .select({
        urlHash: redirectEventTable.url_hash,
        numberOfRedirects: count(redirectEventTable.id).as(
          'number_of_redirects',
        ),
        latestRedirectTimestamp: max(redirectEventTable.visited_at).as(
          'latest_redirect_timestamp',
        ),
      })
      .from(redirectEventTable)
      .groupBy(redirectEventTable.url_hash)
      .as('redirect_stats');

    const numberOfTagsExpression = sql<number>`coalesce(${tagStats.numberOfTags}, 0)`;
    const numberOfRedirectsExpression = sql<number>`coalesce(${redirectStats.numberOfRedirects}, 0)`;

    const primaryOrderBy = (() => {
      switch (sortBy) {
        case 'hash':
          return sortOrder === 'asc' ? asc(urlTable.hash) : desc(urlTable.hash);
        case 'originalUrl':
          return sortOrder === 'asc'
            ? asc(urlTable.original_url)
            : desc(urlTable.original_url);
        case 'numberOfTags':
          return sortOrder === 'asc'
            ? asc(numberOfTagsExpression)
            : desc(numberOfTagsExpression);
        case 'numberOfRedirects':
        default:
          return sortOrder === 'asc'
            ? asc(numberOfRedirectsExpression)
            : desc(numberOfRedirectsExpression);
      }
    })();

    const orderByClauses =
      sortBy === 'hash'
        ? [primaryOrderBy]
        : [primaryOrderBy, asc(urlTable.hash)];

    const metadataPromise = this.db
      .select({
        hash: urlTable.hash,
        originalUrl: urlTable.original_url,
        ownerName: userTable.name,
        ownerEmail: userTable.email,
        numberOfTags: numberOfTagsExpression,
        numberOfRedirects: numberOfRedirectsExpression,
        latestRedirectTimestamp: redirectStats.latestRedirectTimestamp,
      })
      .from(urlTable)
      .innerJoin(userTable, eq(urlTable.user_id, userTable.id))
      .leftJoin(tagStats, eq(tagStats.urlHash, urlTable.hash))
      .leftJoin(redirectStats, eq(redirectStats.urlHash, urlTable.hash))
      .where(eq(urlTable.user_id, userId))
      .orderBy(...orderByClauses)
      .limit(pageSize)
      .offset(offset);

    const totalPromise = this.db
      .select({ total: count() })
      .from(urlTable)
      .where(eq(urlTable.user_id, userId));

    const [data, [totalRow]] = await Promise.all([
      metadataPromise,
      totalPromise,
    ]);

    return {
      data,
      total: totalRow?.total ?? 0,
      page,
      pageSize,
    };
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
        original_url: url,
        user_id: userId,
      })
      .returning({
        hash: urlTable.hash,
        originalUrl: urlTable.original_url,
        createdAt: urlTable.created_at,
        userId: urlTable.user_id,
      });

    await this.cache.set(hash, urlData);

    return urlData;
  }

  async getNumberOfUrlsPerUser() {
    const result = this.db
      .select({
        name: userTable.name,
        numberOfUrls: count(userTable.id).as('number_of_urls'),
      })
      .from(userTable)
      .innerJoin(urlTable, eq(userTable.id, urlTable.user_id))
      .groupBy(userTable.name)
      .having(gt(count(userTable.id), 3))
      .orderBy(sql`number_of_urls desc`);

    return result;
  }

  async getUrlsFromPeriod(days: number): Promise<any> {
    const events = this.db
      .select({
        id: redirectEventTable.id,
        urlHash: redirectEventTable.url_hash,
      })
      .from(redirectEventTable)
      .where(
        gte(
          redirectEventTable.visited_at,
          sql`now() - (${days} * interval '1 day')`,
        ),
      )
      .as('events');

    return this.db
      .select({
        originalUrl: urlTable.original_url,
      })
      .from(urlTable)
      .innerJoin(events, eq(urlTable.hash, events.urlHash))
      .groupBy(urlTable.hash, urlTable.original_url)
      .having(gte(count(events.id), 100));
  }

  async getTagsByThreshold(responseTime: number) {
    return this.db
      .select({
        tagName: urlTagTable.tag_name,
      })
      .from(redirectEventTable)
      .innerJoin(
        urlTagTable,
        eq(urlTagTable.url_hash, redirectEventTable.url_hash),
      )
      .groupBy(urlTagTable.tag_name)
      .having(gte(avg(redirectEventTable.response_ms), responseTime));
  }
}
