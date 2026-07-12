import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { PaginatedUrlMetadata } from 'src/types/url.types';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: jest.Mocked<Pick<UrlService, 'getUrlMetadata'>>;

  beforeEach(async () => {
    urlService = {
      getUrlMetadata: jest.fn(),
    };

    const moduleBuilder = Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: urlService,
        },
      ],
    }).overrideGuard(AuthGuard).useValue({
      canActivate: jest.fn().mockResolvedValue(true),
    });

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('passes authenticated user scope and query options to the service', async () => {
    const expected: PaginatedUrlMetadata = {
      data: [],
      total: 0,
      page: 2,
      pageSize: 10,
    };

    urlService.getUrlMetadata.mockResolvedValue(expected);

    const request = {
      user: {
        sub: 'user-123',
        email: 'owner@example.com',
      },
    } as any;

    const result = await controller.getUrlMetadata(
      request,
      2,
      10,
      'numberOfTags',
      'asc',
    );

    expect(urlService.getUrlMetadata).toHaveBeenCalledWith({
      userId: 'user-123',
      page: 2,
      pageSize: 10,
      sortBy: 'numberOfTags',
      sortOrder: 'asc',
    });
    expect(result).toBe(expected);
  });

  it('rejects page values below 1', async () => {
    const request = {
      user: {
        sub: 'user-123',
        email: 'owner@example.com',
      },
    } as any;

    await expect(
      controller.getUrlMetadata(
        request,
        0,
        20,
        'numberOfRedirects',
        'desc',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects pageSize values outside the supported range', async () => {
    const request = {
      user: {
        sub: 'user-123',
        email: 'owner@example.com',
      },
    } as any;

    await expect(
      controller.getUrlMetadata(request, 1, 101, 'numberOfRedirects', 'desc'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects unsupported sort fields', async () => {
    const request = {
      user: {
        sub: 'user-123',
        email: 'owner@example.com',
      },
    } as any;

    await expect(
      controller.getUrlMetadata(request, 1, 20, 'createdAt', 'desc'),
    ).rejects.toThrow(BadRequestException);
  });
});
