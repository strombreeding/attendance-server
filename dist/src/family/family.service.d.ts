import { Model } from 'mongoose';
import { Family, FamilyDocument } from './schemas/family.schema';
export declare class FamilyService {
    private familyModel;
    constructor(familyModel: Model<FamilyDocument>);
    getFamilyInfo(code: number, month?: number): Promise<Family & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateOtherFamily(code: number, month: number, toUpdate: any): Promise<boolean>;
    updateMyFamily(code: number, month: number, toUpdate: any): Promise<boolean>;
    addNewFamily(souce: any): Promise<void>;
    ㅌㅌ(): Promise<void>;
}
