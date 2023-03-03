import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
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

  async likesMsg(id: string, liker: string) {
    const aleardy = await this.fightModel.findOne({ liker });
    console.log(aleardy);
    if (!aleardy) {
      await this.fightModel.create({ liker });
    } else {
      if (aleardy.likes > 10) {
        throw new HttpException(
          '오늘 하루 좋아요 가능개수를 넘었습니다.\n하루 최대 10번',
          400,
        );
      }
    }
    const newLiker = await this.fightModel.findOne({ liker });
    await this.fightModel.findOneAndUpdate(
      { liker },
      { $set: { likes: newLiker.likes + 1 } },
    );
    const likesId = await this.fightModel.findById(id);
    await this.fightModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: { likes: likesId.likes + 1 },
      },
    );

    return true;
  }
}
