import mongoose, { Document } from 'mongoose';
export type EtcDocument = Etc & Document;
export declare class Etc {
    createdAt: Date;
    updatedAt: Date | number;
    text: string;
    ownerFamilyCode: number;
    week: number;
    month: number;
    year: number;
    pw: number;
}
export declare const EtcSchema: mongoose.Schema<Etc, mongoose.Model<Etc, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Etc>;
