"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const family_module_1 = require("./family/family.module");
const mongoose_1 = require("@nestjs/mongoose");
const etc_module_1 = require("./etc/etc.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            common_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => ({
                    ttl: 10000,
                    url: process.env.REDIS_URL,
                }),
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URL),
            family_module_1.FamilyModule,
            etc_module_1.EtcModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
`redis[s]://[[default][:password]@][host][:port][/db-number]`;
//# sourceMappingURL=app.module.js.map