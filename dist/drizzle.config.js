"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_fs_1 = require("node:fs");
const drizzle_kit_1 = require("drizzle-kit");
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
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle',
    schema: ['./src/db/schema.ts'],
    dialect: 'postgresql',
    dbCredentials: {
        url: getDatabaseUrl(),
    },
});
//# sourceMappingURL=drizzle.config.js.map