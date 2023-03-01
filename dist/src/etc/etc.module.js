"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtcModule = void 0;
const common_1 = require("@nestjs/common");
const etc_service_1 = require("./etc.service");
const etc_controller_1 = require("./etc.controller");
const mongoose_1 = require("@nestjs/mongoose");
const etc_schema_1 = require("./schemas/etc.schema");
const family_module_1 = require("../family/family.module");
let EtcModule = class EtcModule {
};
EtcModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: etc_schema_1.Etc.name, schema: etc_schema_1.EtcSchema }]),
            family_module_1.FamilyModule,
        ],
        providers: [etc_service_1.EtcService],
        controllers: [etc_controller_1.EtcController],
        exports: [
            etc_service_1.EtcService,
            mongoose_1.MongooseModule.forFeature([{ name: etc_schema_1.Etc.name, schema: etc_schema_1.EtcSchema }]),
        ],
    })
], EtcModule);
exports.EtcModule = EtcModule;
//# sourceMappingURL=etc.module.js.map