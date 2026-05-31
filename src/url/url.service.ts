import { Injectable } from '@nestjs/common';
import { UrlRepository } from './url.repository';
import { randomBytes } from 'node:crypto';
import { CreateUrl, UrlData } from 'src/types/url.types';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepo: UrlRepository) {}

  async getUrlByHash(hash: string): Promise<UrlData> {
    return this.urlRepo.getUrlByHash(hash);
  }

  async saveUrl({ userId, url }: CreateUrl) {
    const hash = randomBytes(7).toString('base64url');

    return await this.urlRepo.saveUrl({ userId, url, hash });
  }
}
