import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [DbModule, UserModule, UrlModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
