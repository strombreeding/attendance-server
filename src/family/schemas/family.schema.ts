import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type FamilyDocument = Family & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Family {
  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop() // MongoDB에 들어갈 설정들을 적어준다.
  familyName: string; // 필드 이름: 타입(타입스크립트 타입)

  @Prop()
  familyCode: number;

  @Prop()
  month: number;

  @Prop({ required: false })
  year: number;

  @Prop()
  unique: string;

  // object를 저장하는 것도 가능하다.
  @Prop()
  startLength: number;
  @Prop()
  endLength: number;

  @Prop()
  members: string[];
}

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const FamilySchema = SchemaFactory.createForClass(Family);
