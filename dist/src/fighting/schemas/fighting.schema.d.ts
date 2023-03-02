import mongoose, { Document } from 'mongoose';
export type FightingDocument = Fighting & Document;
export declare class Fighting {
    createdAt: Date;
    content: string;
    author: string;
    likes: number;
}
export declare const FightingSchema: mongoose.Schema<Fighting, mongoose.Model<Fighting, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Fighting>;
