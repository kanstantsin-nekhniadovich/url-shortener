"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_fs_1 = require("node:fs");
const node_postgres_1 = require("drizzle-orm/node-postgres");
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
const db = (0, node_postgres_1.drizzle)(getDatabaseUrl());
exports.default = db;
//# sourceMappingURL=client.js.map