import type { DB } from '../../db/client';
import { UrlData } from "../../types/url.types";
export declare class UrlRepository {
    private readonly db;
    constructor(db: DB);
    getUrlByHash(hash: string): Promise<UrlData>;
    saveUrl({ url, hash, userId, }: {
        url: string;
        hash: string;
        userId: string;
    }): Promise<{
        hash: string;
        originalUrl: string;
        createdAt: Date | null;
        userId: string | null;
    }>;
}
