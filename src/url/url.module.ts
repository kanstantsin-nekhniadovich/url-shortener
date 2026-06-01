import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlRepository } from './url.repository';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';


@Module({
  imports: [
    AuthModule,
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 500 }),
            }),
            new KeyvRedis(
              `redis://:${encodeURIComponent(process.env.REDIS_PASSWORD ?? '')}@redis:6379`,
            ),
          ],
        };
      },
    }),
  ],
  exports: [],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository],
})
export class UrlModule {}
