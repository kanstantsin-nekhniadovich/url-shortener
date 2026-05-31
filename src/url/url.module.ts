import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlRepository } from './url.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  exports: [],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository],
})
export class UrlModule {}
