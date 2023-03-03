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
exports.FightingController = void 0;
const common_1 = require("@nestjs/common");
const fighting_service_1 = require("./fighting.service");
let FightingController = class FightingController {
    constructor(fightService) {
        this.fightService = fightService;
    }
    async getMsgs() {
        console.log('파이팅 겟');
        return await this.fightService.getMsg();
    }
    async postMsg(body) {
        console.log('파이팅 포스트 들어옴');
        await this.fightService.postMsg(body);
        return true;
    }
    async likesMsg(body) {
        const { id, liker } = body;
        await this.fightService.likesMsg(id, liker);
        return true;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FightingController.prototype, "getMsgs", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FightingController.prototype, "postMsg", null);
__decorate([
    (0, common_1.Patch)('/likes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FightingController.prototype, "likesMsg", null);
FightingController = __decorate([
    (0, common_1.Controller)('fighting'),
    __metadata("design:paramtypes", [fighting_service_1.FightingService])
], FightingController);
exports.FightingController = FightingController;
//# sourceMappingURL=fighting.controller.js.map