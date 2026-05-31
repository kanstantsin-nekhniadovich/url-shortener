import { UrlRepository } from './url.repository';
import { CreateUrl, UrlData } from "../../types/url.types";
export declare class UrlService {
    private readonly urlRepo;
    constructor(urlRepo: UrlRepository);
    getUrlByHash(hash: string): Promise<UrlData>;
    saveUrl({ userId, url }: CreateUrl): Promise<{
        hash: string;
        originalUrl: string;
        createdAt: Date | null;
        userId: string | null;
    }>;
}
