"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
const common_1 = require("@nestjs/common");
const url_repository_1 = require("./url.repository");
const node_crypto_1 = require("node:crypto");
let UrlService = class UrlService {
    urlRepo;
    constructor(urlRepo) {
        this.urlRepo = urlRepo;
    }
    async getUrlByHash(hash) {
        return this.urlRepo.getUrlByHash(hash);
    }
    async saveUrl({ userId, url }) {
        const hash = (0, node_crypto_1.randomBytes)(7).toString('base64url');
        return await this.urlRepo.saveUrl({ userId, url, hash });
    }
};
exports.UrlService = UrlService;
exports.UrlService = UrlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [url_repository_1.UrlRepository])
], UrlService);
//# sourceMappingURL=url.service.js.map