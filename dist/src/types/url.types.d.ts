export interface CreateUrl {
    userId: string;
    url: string;
}
export interface UrlData {
    hash: string;
    originalUrl: string | null;
    createdAt: Date | null;
    userId: string | null;
}
