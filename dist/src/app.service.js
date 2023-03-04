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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const family_service_1 = require("./family/family.service");
const utils = require("./utils/utilFuc");
const spreadsheetId = '1CciTO1XPWidHNVyozEivRy-e8pl0tkw6KHQ4eYmQYto';
const readerCount = 7;
let toggle = '';
let sheetIds = [];
let AppService = class AppService {
    constructor(familyService, cacheManager) {
        this.familyService = familyService;
        this.cacheManager = cacheManager;
        this.googleSheet = utils.connectGoogleApi();
    }
    async getFamilyInfo(code, month) {
        const family = await this.familyService.getFamilyInfo(code, month);
        return family;
    }
    async getAttendInfo(code, month) {
        const family = await this.familyService.getFamilyInfo(code, month);
        const nowWeek = utils.getNowWeek();
        const column = utils.getColumnNumber(nowWeek);
        const attendFamily = await this.googleSheet.spreadsheets.values.get({
            spreadsheetId,
            range: `${month}!${column}${family.startLength}:${column}${family.endLength}`,
        });
        let resultNum = 0;
        console.log(attendFamily.data.values);
        if (attendFamily.data.values) {
            for (let i = 0; i < attendFamily.data.values.length; i++) {
                const checked = ['🟢', '🟡'];
                if (checked.includes(attendFamily.data.values[i][0])) {
                    ++resultNum;
                }
            }
            if (resultNum > 0)
                return attendFamily.data.values;
            return undefined;
        }
        else {
            return undefined;
        }
    }
    async appendNewMember(newFaceName, arr) {
        const date = utils.getDate().month;
        await this.appendNewFace(newFaceName, arr, date);
        return true;
    }
    async deleteMembers(target, code) {
        const date = utils.getDate().month;
        const familyInfo = await this.familyService.getFamilyInfo(code, date);
        const targetIndex = familyInfo.members.lastIndexOf(target);
        if (targetIndex === -1)
            throw new common_1.HttpException('없는애임..', 400);
        const removeTarget = familyInfo.startLength + targetIndex - 1;
        console.log(removeTarget, '리부드');
        for (let i = date; i <= 12; i++) {
            console.log(sheetIds[i - 1]);
            const deleteMemberInSheets = await this.googleSheet.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId: sheetIds[i - 1],
                                    dimension: 'ROWS',
                                    startIndex: removeTarget,
                                    endIndex: removeTarget + 1,
                                },
                            },
                        },
                    ],
                },
            });
        }
        console.log('ㅎㅇㅎㅇ');
    }
    async plusFamilyLength(code, newMember) {
        const date = utils.getDate().month;
        const myCode = await this.getFamilyInfo(code, date);
        myCode.endLength = myCode.endLength + 1;
        myCode.members.push(newMember);
        for (let i = code + 1; i <= readerCount; i++) {
            const otherCode = await this.getFamilyInfo(i, date);
            const toUpdate = {
                startLength: otherCode.startLength + 1,
                endLength: otherCode.endLength + 1,
            };
            console.log(otherCode.familyName, ' 업뎃중... ');
            await this.familyService.updateOtherFamily(otherCode.familyCode, date, toUpdate);
            console.log(' 업댓내역 : ', toUpdate);
        }
        console.log('다른 가족 정보변경 완료! 이제 내꺼 변경 시작');
        const toUpdate = {
            endLength: myCode.endLength,
            members: myCode.members,
        };
        await this.familyService.updateMyFamily(code, date, toUpdate);
        console.log('본인 소스 DB 업뎃완료');
        return true;
    }
    async minusFamilyLength(code, targetName) {
        const date = utils.getDate().month;
        const myCode = await this.getFamilyInfo(code, date);
        console.log(myCode.members);
        const targetIndex = myCode.members.lastIndexOf(targetName);
        if (targetIndex < 0)
            throw new Error('없는 애임');
        myCode.endLength = myCode.endLength - 1;
        myCode.members.splice(targetIndex, 1);
        console.log(myCode.members);
        for (let i = code + 1; i <= 7; i++) {
            const otherCode = await this.getFamilyInfo(i, date);
            console.log(otherCode.familyName, ' 업뎃중... ');
            const toUpdate = {
                startLength: otherCode.startLength - 1,
                endLength: otherCode.endLength - 1,
            };
            console.log(' 업댓내역 : ', toUpdate);
            await this.familyService.updateOtherFamily(i, date, toUpdate);
        }
        const toUpdate = {
            endLength: myCode.endLength,
            members: [...myCode.members],
        };
        await this.familyService.updateMyFamily(code, date, toUpdate);
        return true;
    }
    async postAttendance(data, nowWeek, info) {
        const startIndex = info.startLength;
        const memberLength = info.members.length;
        const toUpdate = [];
        const date = utils.getDate().month;
        const column = utils.getColumnNumber(nowWeek);
        console.log('컬럼 ;', column);
        for (let i = 0; i < memberLength; i++) {
            let dataList = [...data.list];
            if (dataList.length > 0) {
                for (let a = 0; a < dataList.length; a++) {
                    if (data.list[a].index === i) {
                        toUpdate.push([`${data.list[a].attend}`]);
                        dataList.splice(a, 1);
                        break;
                    }
                }
            }
            if (toUpdate.length >
                i) {
            }
            else {
                toUpdate.push([` `]);
            }
        }
        console.log(toUpdate);
        const context = await this.googleSheet.spreadsheets.values.update({
            spreadsheetId,
            range: `${date}!${column}${startIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: toUpdate,
            },
        });
    }
    async getSheetIds() {
        const context = await this.googleSheet.spreadsheets.get({
            spreadsheetId,
        });
        const charge = [];
        for (let i = 0; i < context.data.sheets.length; i++) {
            charge.push(context.data.sheets[i].properties.sheetId);
        }
        console.log(context.data.sheets);
        console.log(sheetIds);
        sheetIds = charge;
        console.log(sheetIds);
    }
    async append(range, insertDataOption, values) {
        await this.googleSheet.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption,
            requestBody: { values },
        });
    }
    async appendNewFace(newFaceName, arr, i) {
        const addNewFaceToSheet = await this.append(`${i}!A${Number(arr[1]) + 1}`, 'INSERT_ROWS', [['', newFaceName]]);
        console.log('arr 값 : ', arr);
        console.log('i(월) 값 : ', i);
        console.log('스타트 : ', Number(arr[0]) - 1);
        console.log('엔드 : ', Number(arr[1]) + 1);
        const mergeCells = async (sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex) => {
            await this.googleSheet.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            mergeCells: {
                                range: {
                                    sheetId: sheetIds[i - 1],
                                    startRowIndex,
                                    endRowIndex,
                                    startColumnIndex,
                                    endColumnIndex,
                                },
                                mergeType: 'MERGE_COLUMNS',
                            },
                        },
                    ],
                },
            });
        };
        await Promise.all([
            mergeCells(sheetIds[i - 1], Number(arr[0]) - 1, Number(arr[1]) + 1, 3, 4),
            mergeCells(sheetIds[i - 1], Number(arr[0]) - 1, Number(arr[1]) + 1, 5, 6),
            mergeCells(sheetIds[i - 1], Number(arr[0]) - 1, Number(arr[1]) + 1, 7, 8),
            mergeCells(sheetIds[i - 1], Number(arr[0]) - 1, Number(arr[1]) + 1, 9, 10),
            mergeCells(sheetIds[i - 1], Number(arr[0]) - 1, Number(arr[1]) + 1, 11, 12),
        ]);
        const addEmptyRows = await this.append(`${i}!A${Number(arr[1]) + 2}`, 'OVERWRITE', [['']]);
        console.log('스프레드 시트', i, '에 행 추가 완료!!');
        return true;
    }
    async complateAttendance() {
        const month = utils.getDate().month;
        const nowWeek = utils.getNowWeek();
        const column = utils.getColumnNumber(nowWeek);
        const context = await this.googleSheet.spreadsheets.values.get({
            spreadsheetId,
            range: `${month}!${column}3:${column}100`,
        });
        console.log(context.data.values);
        const attendance = {
            halfAttend: 0,
            fullAttend: 0,
        };
        for (let i = 0; i < context.data.values.length; i++) {
            if (context.data.values[i][0] === '🟢') {
                attendance.fullAttend = attendance.fullAttend + 1;
            }
            else if (context.data.values[i][0] === '🟡') {
                attendance.halfAttend = attendance.halfAttend + 1;
            }
        }
        const result = [`${attendance.fullAttend} / ${attendance.halfAttend}`];
        await this.googleSheet.spreadsheets.values.update({
            spreadsheetId,
            range: `${month}!${column}2`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [result],
            },
        });
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(family_service_1.FamilyService)),
    __param(1, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [family_service_1.FamilyService, Object])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map