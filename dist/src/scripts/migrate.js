"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
function getDatabaseUrl() {
    const databaseUrl = process.env.POSTGRES_URL;
    if (!databaseUrl) {
        throw new Error('POSTGRES_URL is not set');
    }
    const resolvedUrl = new URL(databaseUrl);
    if (!(0, node_fs_1.existsSync)('/.dockerenv') && resolvedUrl.hostname === 'postgres') {
        resolvedUrl.hostname = 'localhost';
    }
    return resolvedUrl.toString();
}
async function main() {
    const db = (0, node_postgres_1.drizzle)(getDatabaseUrl());
    await (0, migrator_1.migrate)(db, { migrationsFolder: (0, node_path_1.join)(process.cwd(), 'drizzle') });
    console.log('Migrations applied');
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map