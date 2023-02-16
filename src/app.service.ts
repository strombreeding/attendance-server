import { Injectable } from '@nestjs/common';
import * as utils from './utils/utilFuc';
const spreadsheetId = '1CciTO1XPWidHNVyozEivRy-e8pl0tkw6KHQ4eYmQYto';

@Injectable()
export class AppService {
  private googleSheet = utils.connectGoogleApi();
  private nowDate = utils.getDate();
  async getHello() {
    return 'Hello World!';
  }

  async getFamilyLength(code: number) {
    const context = await this.googleSheet.spreadsheets.values.get({
      spreadsheetId,
      range: `DB!A${code}:B${code}`,
    });
    return context.data.values[0];
  }

  async getFamilyMembers(arr: Array<string>) {
    const context = await this.googleSheet.spreadsheets.values.get({
      spreadsheetId,
      range: `${this.nowDate.month}!B${arr[0]}:B${arr[1]}`,
    });
    const result = [];
    for (let i = 0; i < context.data.values.length; i++) {
      result.push(context.data.values[i][0]);
    }
    return result;
  }
  async appendNewFace(newFaceName: string, arr: Array<string>) {
    console.log(arr, newFaceName);
    const addNewFaceToSheet = await this.append(
      `${this.nowDate.month}!A${Number(arr[1]) + 1}`,
      'INSERT_ROWS',
      [['', newFaceName]],
    );
    const addEmptyRows = await this.append(
      `${this.nowDate.month}!A${Number(arr[1]) + 2}`,
      'OVERWRITE',
      [['']],
    );
  }

  async plusFamilyLength(code: number) {
    for (let i = code + 1; i <= 7; i++) {
      const otherCode = await this.getFamilyLength(i);
      otherCode[0] = Number(otherCode[0]) + 1;
      otherCode[1] = Number(otherCode[1]) + 1;
      // 해당 코드 업데이트
      await this.googleSheet.spreadsheets.values.update({
        spreadsheetId,
        range: `DB!A${i}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[otherCode[0], otherCode[1]]] },
      });
    }
    const myCode = await this.getFamilyLength(code);
    myCode[1] = Number(myCode[1]) + 1;
    // 본인코드 업뎃
    await this.googleSheet.spreadsheets.values.update({
      spreadsheetId,
      range: `DB!A${code}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[myCode[0], myCode[1]]] },
    });
  }
  async minusFamilyLength(code: number) {
    for (let i = code + 1; i <= 7; i++) {
      const otherCode = await this.getFamilyLength(i);
      otherCode[0] = Number(otherCode[0]) - 1;
      otherCode[1] = Number(otherCode[1]) - 1;
      // 해당 코드 업데이트
      await this.googleSheet.spreadsheets.values.update({
        spreadsheetId,
        range: `DB!A${i}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[otherCode[0], otherCode[1]]] },
      });
    }
    const myCode = await this.getFamilyLength(code);
    myCode[1] = Number(myCode[1]) - 1;
    // 본인코드 업뎃
    await this.googleSheet.spreadsheets.values.update({
      spreadsheetId,
      range: `DB!A${code}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[myCode[0], myCode[1]]] },
    });
  }

  async deleteMembers(removeTarget: number, code: number) {
    const context = await this.googleSheet.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 2022213536,
                dimension: 'ROWS',
                startIndex: removeTarget - 1,
                endIndex: removeTarget,
              },
            },
          },
        ],
      },
    });
    console.log('ㅎㅇㅎㅇ');
  }
  async test() {
    // 시트아이디 보는것
    const context = await this.googleSheet.spreadsheets.get({
      spreadsheetId,
    });
    console.log(context.data.sheets);
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
}
