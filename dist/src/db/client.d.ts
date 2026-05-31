import 'dotenv/config';
declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: import("pg").Pool;
};
export type DB = typeof db;
export default db;
