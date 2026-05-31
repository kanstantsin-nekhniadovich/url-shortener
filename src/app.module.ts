import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DbModule, UserModule, UrlModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
