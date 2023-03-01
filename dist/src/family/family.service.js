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
exports.FamilyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const family_schema_1 = require("./schemas/family.schema");
const utils = require("../utils/utilFuc");
let FamilyService = class FamilyService {
    constructor(familyModel) {
        this.familyModel = familyModel;
    }
    async getFamilyInfo(code, month) {
        const nowDate = utils.getDate();
        try {
            if (month > 0 && month < 13) {
                const familyInfo = await this.familyModel.findOne({
                    familyCode: code,
                    month,
                });
                return familyInfo;
            }
            else {
                const familyInfo = await this.familyModel.findOne({
                    familyCode: code,
                });
                return familyInfo;
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }
    async updateOtherFamily(code, month, toUpdate) {
        const nowDate = utils.getDate();
        try {
            await this.familyModel.updateMany({ familyCode: code, month: { $gte: month } }, { $set: toUpdate });
            return true;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async updateMyFamily(code, month, toUpdate) {
        const nowDate = utils.getDate();
        try {
            await this.familyModel.updateMany({ familyCode: code, month: { $gte: month } }, { $set: toUpdate });
            return true;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async addNewFamily(souce) {
        try {
            await this.familyModel.create(souce);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async ㅌㅌ() {
        await this.familyModel.deleteMany({ familyName: '주영가족' });
    }
};
FamilyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(family_schema_1.Family.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FamilyService);
exports.FamilyService = FamilyService;
//# sourceMappingURL=family.service.js.map