"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlTable = exports.userTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userTable = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.uuid)().primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)().notNull(),
    email: (0, pg_core_1.varchar)().notNull(),
});
exports.urlTable = (0, pg_core_1.pgTable)('url', {
    hash: (0, pg_core_1.varchar)().primaryKey(),
    originalUrl: (0, pg_core_1.varchar)().notNull(),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    userId: (0, pg_core_1.uuid)().references(() => exports.userTable.id),
});
//# sourceMappingURL=schema.js.map