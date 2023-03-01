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
exports.EtcService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const etc_schema_1 = require("./schemas/etc.schema");
const utils = require("../utils/utilFuc");
const family_service_1 = require("../family/family.service");
const spreadsheetId = '1CciTO1XPWidHNVyozEivRy-e8pl0tkw6KHQ4eYmQYto';
let EtcService = class EtcService {
    constructor(etcModel, familyService) {
        this.etcModel = etcModel;
        this.familyService = familyService;
        this.googleSheet = utils.connectGoogleApi();
    }
    async getEtc(code) {
        const date = utils.getDate();
        const week = utils.getNowWeek();
        const result = await this.etcModel.findOne({
            ownerFamilyCode: code,
            month: date.month,
            week,
            year: date.year,
        });
        if (!result)
            return undefined;
        return result.text;
    }
    async getEtcMonth(code, text, month, nowWeek) {
        const year = new Date().getFullYear();
        const etc = {
            text,
            ownerFamilyCode: code,
            week: nowWeek,
            month,
            year,
        };
        const aleardyEtc = await this.etcModel.findOne({
            year,
            ownerFamilyCode: code,
            month,
            week: nowWeek,
        });
        if (!aleardyEtc) {
            await this.etcModel.create(etc);
        }
        else {
            await this.etcModel.findOneAndUpdate({
                year,
                ownerFamilyCode: code,
                month,
                week: nowWeek,
            }, { $set: etc });
        }
        return true;
    }
    async postSheet(code, month, nowWeek, text) {
        const familyInfo = await this.familyService.getFamilyInfo(code, month);
        const arr = [];
        const column = utils.getColumnNumberForEtc(nowWeek);
        arr.push(familyInfo.startLength);
        const context = await this.googleSheet.spreadsheets.values.update({
            spreadsheetId,
            range: `${month}!${column}${arr[0]}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[text]],
            },
        });
        return familyInfo;
    }
};
EtcService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(etc_schema_1.Etc.name)),
    __param(1, (0, common_1.Inject)(family_service_1.FamilyService)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        family_service_1.FamilyService])
], EtcService);
exports.EtcService = EtcService;
//# sourceMappingURL=etc.service.js.map