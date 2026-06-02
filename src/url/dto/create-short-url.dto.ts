import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { CreateUrl } from '../../types/url.types';

export class CreateShortUrlDto implements CreateUrl {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
