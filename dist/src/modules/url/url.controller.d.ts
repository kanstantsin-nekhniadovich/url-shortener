import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { UrlData } from "../../types/url.types";
import { UrlService } from './url.service';
export declare class UrlController {
    private readonly urlService;
    constructor(urlService: UrlService);
    getOriginalUrl(hash: string): Promise<UrlData>;
    createShortUrl(body: CreateShortUrlDto): Promise<UrlData>;
}
