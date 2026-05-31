"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlModule = void 0;
const common_1 = require("@nestjs/common");
const url_service_1 = require("./url.service");
const url_controller_1 = require("./url.controller");
const url_repository_1 = require("./url.repository");
let UrlModule = class UrlModule {
};
exports.UrlModule = UrlModule;
exports.UrlModule = UrlModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        exports: [],
        controllers: [url_controller_1.UrlController],
        providers: [url_service_1.UrlService, url_repository_1.UrlRepository],
    })
], UrlModule);
//# sourceMappingURL=url.module.js.map