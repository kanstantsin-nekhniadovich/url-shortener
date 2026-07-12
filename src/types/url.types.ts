export interface CreateUrl {
  userId: string;
  url: string;
}

export type UrlMetadataSortBy =
  | 'hash'
  | 'originalUrl'
  | 'numberOfTags'
  | 'numberOfRedirects';

export type SortOrder = 'asc' | 'desc';

export interface UrlData {
  hash: string;
  originalUrl: string | null;
  createdAt: Date | null;
  userId: string | null;
}

export interface UrlMetadata {
  hash: string;
  originalUrl: string;
  ownerName: string;
  ownerEmail: string;
  numberOfTags: number;
  numberOfRedirects: number;
  latestRedirectTimestamp: Date | null;
}

export interface GetUrlMetadataOptions {
  userId: string;
  page: number;
  pageSize: number;
  sortBy: UrlMetadataSortBy;
  sortOrder: SortOrder;
}

export interface PaginatedUrlMetadata {
  data: UrlMetadata[];
  total: number;
  page: number;
  pageSize: number;
}
