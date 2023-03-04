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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const utils = require("./utils/utilFuc");
let working = false;
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getFamily(name) {
        console.log('들어옴?');
        try {
            const familyCode = utils.getReader(name);
            const date = utils.getDate().month;
            const familyInfo = await this.appService.getFamilyInfo(familyCode, date);
            const attendanceInfo = await this.appService.getAttendInfo(familyCode, date);
            if (!attendanceInfo) {
                return { familyInfo, attendanceInfo: null };
            }
            return { familyInfo, attendanceInfo };
        }
        catch (err) {
            console.log('예외');
            throw new Error(err.message);
        }
    }
    async appendNewFace(newFaceName, name) {
        const now = Date.now();
        if (working === true) {
            return '다른 작업이 처리 중입니다. 잠시후에 다시 시도해 주세요';
        }
        const date = utils.getDate().month;
        working = true;
        try {
            const familyCode = utils.getReader(name);
            const familyInfo = await this.appService.getFamilyInfo(familyCode, date);
            const arr = [];
            arr.push(familyInfo.startLength);
            arr.push(familyInfo.endLength);
            await Promise.all([
                this.appService.appendNewMember(newFaceName, arr),
                this.appService.plusFamilyLength(familyCode, newFaceName),
            ]);
            console.log(Date.now() - now, '밀리초 걸림');
            return 'ㅎㅎ';
        }
        catch (err) {
            return err.message;
        }
        finally {
            working = false;
        }
    }
    async deleteMember(name, target) {
        if (working === true) {
            return '다른 작업이 처리 중입니다. 잠시후에 다시 시도해 주세요';
        }
        const now = Date.now();
        try {
            const familyCode = utils.getReader(name);
            await Promise.all([
                this.appService.deleteMembers(target, familyCode),
                this.appService.minusFamilyLength(familyCode, target),
            ]);
            console.log(Date.now() - now, '초 걸림');
            return 'ㅎㅇ';
        }
        catch (err) {
            console.log(err.message);
            throw new common_1.HttpException(err.message, 400);
        }
        finally {
            working = false;
        }
    }
    async getSheetIds() {
        const a = await this.appService.getSheetIds();
        return a;
        return ' zz';
    }
    async attendance(data) {
        console.log(data);
        const date = utils.getDate().month;
        const familyCode = utils.getReader(data.name);
        const familyInfo = await this.appService.getFamilyInfo(familyCode, date);
        const nowWeek = utils.getNowWeek();
        const result = await this.appService.postAttendance(data, nowWeek, familyInfo);
        return result;
    }
    async complateAttendance() {
        await this.appService.complateAttendance();
    }
};
__decorate([
    (0, common_1.Get)('/members'),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFamily", null);
__decorate([
    (0, common_1.Post)('/members'),
    __param(0, (0, common_1.Body)('newFaceName')),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "appendNewFace", null);
__decorate([
    (0, common_1.Delete)('/members'),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Get)('/sheetIds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getSheetIds", null);
__decorate([
    (0, common_1.Post)('/attendance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "attendance", null);
__decorate([
    (0, common_1.Patch)('/attendance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "complateAttendance", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map