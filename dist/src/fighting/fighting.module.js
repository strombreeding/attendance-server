"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingModule = void 0;
const common_1 = require("@nestjs/common");
const fighting_service_1 = require("./fighting.service");
const fighting_controller_1 = require("./fighting.controller");
const mongoose_1 = require("@nestjs/mongoose");
const fighting_schema_1 = require("./schemas/fighting.schema");
let FightingModule = class FightingModule {
};
FightingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: fighting_schema_1.Fighting.name, schema: fighting_schema_1.FightingSchema },
            ]),
        ],
        providers: [fighting_service_1.FightingService],
        controllers: [fighting_controller_1.FightingController],
        exports: [
            fighting_service_1.FightingService,
            mongoose_1.MongooseModule.forFeature([
                { name: fighting_schema_1.Fighting.name, schema: fighting_schema_1.FightingSchema },
            ]),
        ],
    })
], FightingModule);
exports.FightingModule = FightingModule;
//# sourceMappingURL=fighting.module.js.map