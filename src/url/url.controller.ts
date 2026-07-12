import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import {
  GetUrlMetadataOptions,
  PaginatedUrlMetadata,
  SortOrder,
  UrlData,
  UrlMetadataSortBy,
} from 'src/types/url.types';
import { UrlService } from './url.service';
import { AuthGuard } from '../auth/auth.guard';

const metadataSortFields: UrlMetadataSortBy[] = [
  'hash',
  'originalUrl',
  'numberOfTags',
  'numberOfRedirects',
];

const metadataSortOrders: SortOrder[] = ['asc', 'desc'];

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
  };
};

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(AuthGuard)
  @Get('metadata')
  async getUrlMetadata(
    @Req() request: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe)
    pageSize: number,
    @Query('sortBy', new DefaultValuePipe('numberOfRedirects')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('desc')) sortOrder: string,
  ): Promise<PaginatedUrlMetadata> {
    if (page < 1) {
      throw new BadRequestException('page must be at least 1');
    }

    if (pageSize < 1 || pageSize > 100) {
      throw new BadRequestException('pageSize must be between 1 and 100');
    }

    if (!metadataSortFields.includes(sortBy as UrlMetadataSortBy)) {
      throw new BadRequestException('sortBy is invalid');
    }

    if (!metadataSortOrders.includes(sortOrder as SortOrder)) {
      throw new BadRequestException('sortOrder is invalid');
    }

    const options: GetUrlMetadataOptions = {
      userId: request.user.sub,
      page,
      pageSize,
      sortBy: sortBy as UrlMetadataSortBy,
      sortOrder: sortOrder as SortOrder,
    };

    return await this.urlService.getUrlMetadata(options);
  }

  @Get('number-of-urls')
  async getNumberOfUrlsPerUser(): Promise<any> {
    return await this.urlService.getNumberOfUrlsPerUser();
  }

  @Get('url-from-period')
  async getUrlsFromPeriod(): Promise<any> {
    return await this.urlService.getUrlsFromPeriod();
  }

  @Get('tags-by-threshold')
  async getTagsByThreshold(): Promise<any> {
    return await this.urlService.getUrlsFromPeriod();
  }

  @Get(':hash')
  async getOriginalUrl(@Param('hash') hash: string): Promise<UrlData | null> {
    return await this.urlService.getUrlByHash(hash);
  }

  @Post()
  async createShortUrl(@Body() body: CreateShortUrlDto): Promise<UrlData> {
    return await this.urlService.saveUrl(body);
  }
}
