import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Etc, EtcDocument } from './schemas/etc.schema';
import * as utils from '../utils/utilFuc';
import { FamilyService } from 'src/family/family.service';

const spreadsheetId = '1CciTO1XPWidHNVyozEivRy-e8pl0tkw6KHQ4eYmQYto';

@Injectable()
export class EtcService {
  constructor(
    @InjectModel(Etc.name)
    private etcModel: Model<EtcDocument>,
    @Inject(FamilyService)
    private familyService: FamilyService,
  ) {}
  private googleSheet = utils.connectGoogleApi();

  async get2eumPw() {
    const pw = await this.etcModel.findOne({ text: '2eumPw' });
    return pw;
  }
  async edit2eumPw(pw: number, updatedAt: number) {
    const result = await this.etcModel.findOneAndUpdate(
      { text: '2eumPw' },
      { $set: { pw, updatedAt } },
    );
    return true;
  }

  async getEtc(code: number) {
    const date = utils.getDate();
    const week = utils.getNowWeek();
    const result = await this.etcModel.findOne({
      ownerFamilyCode: code,
      month: date.month,
      week,
      year: date.year,
    });
    if (!result) return undefined;
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
    } else {
      await this.etcModel.findOneAndUpdate(
        {
          year,
          ownerFamilyCode: code,
          month,
          week: nowWeek,
        },
        { $set: etc },
      );
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
}
