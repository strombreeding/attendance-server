import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fighting, FightingDocument } from './schemas/fighting.schema';

@Injectable()
export class FightingService {
  constructor(
    @InjectModel(Fighting.name)
    private fightModel: Model<FightingDocument>,
  ) {}

  async getMsg() {
    const msgs = await this.fightModel.find({});
    return msgs;
  }

  async postMsg(data: { content: string; author: string }) {
    await this.fightModel.create(data);
    return true;
  }

  async likesMsg(id: string) {
    const a = await this.fightModel.findById(id);
    await this.fightModel.findByIdAndUpdate(id, {
      $set: { likes: a.likes + 1 },
    });
    return true;
  }
}
