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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fighting_schema_1 = require("./schemas/fighting.schema");
let FightingService = class FightingService {
    constructor(fightModel) {
        this.fightModel = fightModel;
    }
    async getMsg() {
        const msgs = await this.fightModel.find({});
        return msgs;
    }
    async postMsg(data) {
        await this.fightModel.create(data);
        return true;
    }
    async likesMsg(id) {
        const a = await this.fightModel.findById(id);
        await this.fightModel.findByIdAndUpdate(id, {
            $set: { likes: a.likes + 1 },
        });
        return true;
    }
};
FightingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fighting_schema_1.Fighting.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FightingService);
exports.FightingService = FightingService;
//# sourceMappingURL=fighting.service.js.map