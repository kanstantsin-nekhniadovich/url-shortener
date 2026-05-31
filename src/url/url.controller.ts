import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { UrlData } from 'src/types/url.types';
import { UrlService } from './url.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(AuthGuard)
  @Get(':hash')
  async getOriginalUrl(@Param('hash') hash: string): Promise<UrlData> {
    return await this.urlService.getUrlByHash(hash);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createShortUrl(@Body() body: CreateShortUrlDto): Promise<UrlData> {
    return await this.urlService.saveUrl(body);
  }
}
