import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { FamilyService } from './family/family.service';
import { Family, FamilyDocument } from './family/schemas/family.schema';
import { CreateAttendance } from './types';
import * as utils from './utils/utilFuc';
const spreadsheetId = '1CciTO1XPWidHNVyozEivRy-e8pl0tkw6KHQ4eYmQYto';
const readerCount = 7;
let toggle = '';
let sheetIds = [];
@Injectable()
export class AppService {
  constructor(
    @Inject(FamilyService)
    private familyService: FamilyService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  private googleSheet = utils.connectGoogleApi();
  //   // DB 구성
  // async createSetApp(name, code, year, startLength, endLength, members) {
  //   const unique = await this.familyService.getFamilyInfo(code);
  //   for (let i = 1; i <= 12; i++) {
  //     const createInfo = {
  //       familyName: `${name}가족`,
  //       familyCode: code,
  //       month: i,
  //       year,
  //       startLength,
  //       endLength,
  //       members,
  //       unique: `${name}가족${i}`,
  //     };
  //     console.log(unique);
  //     await this.familyService.addNewFamily(createInfo);
  //   }
  // }
  // 가족 정보
  async getFamilyInfo(code: number, month?: number) {
    const family = await this.familyService.getFamilyInfo(code, month);
    return family;
  }
  // 출석부 변경 사항
  async getAttendInfo(code: number, month?: number) {
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
      if (resultNum > 0) return attendFamily.data.values;
      return undefined;
    } else {
      return undefined;
    }
  }

  // 멤버 생성
  async appendNewMember(newFaceName, arr) {
    // await this.appendHelper(newFaceName, arr);
    // 12개 시트를 미리 만들어 두려 했으나, 스프레드시트 요청권한상 한번에 하나씩하기로
    const date = utils.getDate().month;
    await this.appendNewFace(newFaceName, arr, date);
    return true;
  }
  // 멤버 지우기
  async deleteMembers(target: string, code: number) {
    const date = utils.getDate().month;

    const familyInfo = await this.familyService.getFamilyInfo(code, date);
    const targetIndex = familyInfo.members.lastIndexOf(target);
    if (targetIndex === -1) throw new HttpException('없는애임..', 400);
    const removeTarget = familyInfo.startLength + targetIndex - 1;
    console.log(removeTarget, '리부드');
    for (let i = date; i <= 12; i++) {
      console.log(sheetIds[i - 1]);
      const deleteMemberInSheets =
        await this.googleSheet.spreadsheets.batchUpdate({
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

  // DB 바꾸는 로직
  async plusFamilyLength(code: number, newMember?: string) {
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
      // for (let a = date; a <= 12; a++) {
      // console.log(`변경시작...`, a, '월 작업');
      await this.familyService.updateOtherFamily(
        otherCode.familyCode,
        date,
        toUpdate,
      );
      console.log(' 업댓내역 : ', toUpdate);
      // }
    }
    console.log('다른 가족 정보변경 완료! 이제 내꺼 변경 시작');
    // 본인코드 업뎃
    const toUpdate = {
      endLength: myCode.endLength,
      members: myCode.members,
    };
    await this.familyService.updateMyFamily(code, date, toUpdate);
    console.log('본인 소스 DB 업뎃완료');
    return true;
  }
  async minusFamilyLength(code: number, targetName: string) {
    const date = utils.getDate().month;
    const myCode = await this.getFamilyInfo(code, date);
    console.log(myCode.members);
    const targetIndex = myCode.members.lastIndexOf(targetName);
    if (targetIndex < 0) throw new Error('없는 애임');

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
    // 본인코드 업뎃
    const toUpdate = {
      endLength: myCode.endLength,
      members: [...myCode.members],
    };
    await this.familyService.updateMyFamily(code, date, toUpdate);
    return true;
  }
  //

  // 출석부 기록
  async postAttendance(data: CreateAttendance, nowWeek: number, info: Family) {
    // 스위치문으로 주차별로 투업데이트를 다르게 하면 될듯
    // // 🟢🟡🔴
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
      if (
        toUpdate.length > //첫번째 들어갔을 경우 투업뎃 랭스 1 여긴 스킵해야함
        i
      ) {
      } else {
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

  // 재시작시 시트 id 램에 다시 저장
  async getSheetIds() {
    // 아래는 시트아이디 보는것
    const context = await this.googleSheet.spreadsheets.get({
      spreadsheetId,
    });
    const charge = [];
    for (let i = 0; i < context.data.sheets.length; i++) {
      charge.push(context.data.sheets[i].properties.sheetId);
    }
    //

    console.log(context.data.sheets);
    console.log(sheetIds);
    sheetIds = charge;
    console.log(sheetIds);

    // 아래는 시트 추가하는것
    // await this.googleSheet.spreadsheets.batchUpdate({
    //   spreadsheetId,
    //   requestBody: {
    //     requests: [
    //       {
    //         addSheet: {
    //           properties: {
    //             title: 'test',
    //             gridProperties: {
    //               rowCount: 8,
    //               columnCount: 200,
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   },
    // });
  }
  /**append 쉽게하려고 만든 메서드 */
  async append(range, insertDataOption, values) {
    await this.googleSheet.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption,
      requestBody: { values },
    });
  }
  async appendNewFace(newFaceName: string, arr: Array<string>, i: number) {
    const addNewFaceToSheet = await this.append(
      `${i}!A${Number(arr[1]) + 1}`,
      'INSERT_ROWS',
      [['', newFaceName]],
    );

    console.log('arr 값 : ', arr);
    console.log('i(월) 값 : ', i);
    console.log('스타트 : ', Number(arr[0]) - 1);
    console.log('엔드 : ', Number(arr[1]) + 1);
    const mergeCells = async (
      sheetId: number,
      startRowIndex: number,
      endRowIndex: number,
      startColumnIndex: number,
      endColumnIndex: number,
    ) => {
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
      mergeCells(
        sheetIds[i - 1],
        Number(arr[0]) - 1,
        Number(arr[1]) + 1,
        9,
        10,
      ),
      mergeCells(
        sheetIds[i - 1],
        Number(arr[0]) - 1,
        Number(arr[1]) + 1,
        11,
        12,
      ),
    ]);
    // const mergeCellFirstWeek = await this.googleSheet.spreadsheets.batchUpdate({
    //   spreadsheetId,
    //   requestBody: {
    //     requests: [
    //       {
    //         mergeCells: {
    //           range: {
    //             sheetId: sheetIds[i - 1],
    //             startRowIndex: Number(arr[0]) - 1,
    //             endRowIndex: Number(arr[1]) + 1,
    //             startColumnIndex: 3,
    //             endColumnIndex: 4,
    //           },
    //           mergeType: 'MERGE_COLUMNS',
    //         },
    //       },
    //     ],
    //   },
    // });
    const addEmptyRows = await this.append(
      `${i}!A${Number(arr[1]) + 2}`,
      'OVERWRITE',
      [['']],
    );
    console.log('스프레드 시트', i, '에 행 추가 완료!!');
    return true;
  }

  // 출석부 갱신
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
      } else if (context.data.values[i][0] === '🟡') {
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
}

// async appendHelper(newFaceName, arr) {
//   const date = utils.getDate().month;
//   const minusDate = 12 - date;
//   switch (minusDate) {
//     case 11:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 1),
//         this.appendNewFace(newFaceName, arr, 2),
//         this.appendNewFace(newFaceName, arr, 3),
//         this.appendNewFace(newFaceName, arr, 4),
//         this.appendNewFace(newFaceName, arr, 5),
//         this.appendNewFace(newFaceName, arr, 6),
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 10:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 2),
//         this.appendNewFace(newFaceName, arr, 3),
//         this.appendNewFace(newFaceName, arr, 4),
//         this.appendNewFace(newFaceName, arr, 5),
//         this.appendNewFace(newFaceName, arr, 6),
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 9:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 3),
//         this.appendNewFace(newFaceName, arr, 4),
//         this.appendNewFace(newFaceName, arr, 5),
//         this.appendNewFace(newFaceName, arr, 6),
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 8:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 4),
//         this.appendNewFace(newFaceName, arr, 5),
//         this.appendNewFace(newFaceName, arr, 6),
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 7:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 5),
//         this.appendNewFace(newFaceName, arr, 6),
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 6:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 6),
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 5:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 7),
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 4:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 8),
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 3:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 9),
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 2:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 10),
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 1:
//       await Promise.all([
//         this.appendNewFace(newFaceName, arr, 11),
//         this.appendNewFace(newFaceName, arr, 12),
//       ]);
//       break;
//     case 0:
//       await Promise.all([this.appendNewFace(newFaceName, arr, 12)]);
//       break;
//   }
// }
