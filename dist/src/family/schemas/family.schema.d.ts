import mongoose, { Document } from 'mongoose';
export type FamilyDocument = Family & Document;
export declare class Family {
    createdAt: Date;
    updatedAt: Date;
    familyName: string;
    familyCode: number;
    month: number;
    year: number;
    unique: string;
    startLength: number;
    endLength: number;
    members: string[];
}
export declare const FamilySchema: mongoose.Schema<Family, mongoose.Model<Family, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Family>;
