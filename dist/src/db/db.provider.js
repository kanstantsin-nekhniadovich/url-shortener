"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbProvider = exports.InjectDb = exports.DB_PROVIDER = void 0;
const common_1 = require("@nestjs/common");
const client_1 = __importDefault(require("./client"));
exports.DB_PROVIDER = 'DbProvider';
const InjectDb = () => (0, common_1.Inject)(exports.DB_PROVIDER);
exports.InjectDb = InjectDb;
exports.dbProvider = {
    provide: exports.DB_PROVIDER,
    useValue: client_1.default,
};
//# sourceMappingURL=db.provider.js.map