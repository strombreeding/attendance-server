import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type FightingDocument = Fighting & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema()
export class Fighting {
  @Prop({ default: new Date(), type: Date, expires: 86400 * 6 })
  createdAt: Date;

  @Prop({ required: false })
  content: string;

  @Prop({ required: false })
  author: string;
  @Prop({ required: false })
  liker: string;

  @Prop({ default: 0 })
  likes: number;
}

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const FightingSchema = SchemaFactory.createForClass(Fighting);
