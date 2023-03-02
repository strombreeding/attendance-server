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
exports.EtcController = void 0;
const common_1 = require("@nestjs/common");
const etc_service_1 = require("./etc.service");
const utils = require("../utils/utilFuc");
let EtcController = class EtcController {
    constructor(etcService) {
        this.etcService = etcService;
    }
    async postEtc(body) {
        const code = utils.getReader(body.name);
        const nowWeek = utils.getNowWeek();
        const date = utils.getDate().month;
        try {
            const workging = await this.etcService.getEtcMonth(code, body.text, date, nowWeek);
            const postGoogleSheet = await this.etcService.postSheet(code, date, nowWeek, body.text);
            return true;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async getEtc(name) {
        const code = utils.getReader(name);
        const etcToWeek = await this.etcService.getEtc(code);
        return etcToWeek;
    }
    async get2eumPw() {
        const pw = await this.etcService.get2eumPw();
        return pw;
    }
    async editPw(body) {
        const { pw } = body;
        const updatedAt = Number(Date.now());
        const result = await this.etcService.edit2eumPw(pw, updatedAt);
        return result;
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EtcController.prototype, "postEtc", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EtcController.prototype, "getEtc", null);
__decorate([
    (0, common_1.Get)('/2eum'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EtcController.prototype, "get2eumPw", null);
__decorate([
    (0, common_1.Post)('/2eum'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EtcController.prototype, "editPw", null);
EtcController = __decorate([
    (0, common_1.Controller)('etc'),
    __metadata("design:paramtypes", [etc_service_1.EtcService])
], EtcController);
exports.EtcController = EtcController;
//# sourceMappingURL=etc.controller.js.map