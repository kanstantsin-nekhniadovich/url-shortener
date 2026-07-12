import { Injectable } from '@nestjs/common';
import { UrlRepository } from './url.repository';
import { randomBytes } from 'node:crypto';
import {
  CreateUrl,
  GetUrlMetadataOptions,
  PaginatedUrlMetadata,
  UrlData,
} from 'src/types/url.types';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepo: UrlRepository) {}

  async getUrlByHash(hash: string): Promise<UrlData | null> {
    return this.urlRepo.getUrlByHash(hash);
  }

  async saveUrl({ userId, url }: CreateUrl) {
    const hash = randomBytes(7).toString('base64url');

    return await this.urlRepo.saveUrl({ userId, url, hash });
  }

  async getUrlMetadata(
    options: GetUrlMetadataOptions,
  ): Promise<PaginatedUrlMetadata> {
    return await this.urlRepo.getUrlMetadata(options);
  }

  async getNumberOfUrlsPerUser(): Promise<any> {
    return await this.urlRepo.getNumberOfUrlsPerUser();
  }

  async getUrlsFromPeriod(): Promise<any> {
    return await this.urlRepo.getUrlsFromPeriod(8);
  }

  async getTagsByThreshold(): Promise<any> {
    return await this.urlRepo.getTagsByThreshold(530);
  }
}
