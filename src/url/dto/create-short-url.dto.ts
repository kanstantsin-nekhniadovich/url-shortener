import { CreateUrl } from '../../types/url.types';

export class CreateShortUrlDto implements CreateUrl {
  userId: string;
  url: string;
}
