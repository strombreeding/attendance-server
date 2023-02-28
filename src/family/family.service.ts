import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Family, FamilyDocument, FamilySchema } from './schemas/family.schema';
import * as utils from '../utils/utilFuc';

@Injectable()
export class FamilyService {
  constructor(
    @InjectModel(Family.name)
    private familyModel: Model<FamilyDocument>,
  ) {}
  async getFamilyInfo(code: number, month?: number) {
    const nowDate = utils.getDate();
    try {
      if (month > 0 && month < 13) {
        const familyInfo = await this.familyModel.findOne({
          familyCode: code,
          month,
        });
        return familyInfo;
      } else {
        const familyInfo = await this.familyModel.findOne({
          familyCode: code,
        });
        return familyInfo;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateOtherFamily(code: number, month: number, toUpdate) {
    const nowDate = utils.getDate();
    try {
      await this.familyModel.updateMany(
        { familyCode: code, month: { $gte: month } },
        { $set: toUpdate },
      );
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async updateMyFamily(code: number, month: number, toUpdate) {
    const nowDate = utils.getDate();
    try {
      await this.familyModel.updateMany(
        { familyCode: code, month: { $gte: month } },
        { $set: toUpdate },
      );
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async addNewFamily(souce) {
    try {
      await this.familyModel.create(souce);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  //
  async ㅌㅌ() {
    await this.familyModel.deleteMany({ familyName: '주영가족' });
  }
}
