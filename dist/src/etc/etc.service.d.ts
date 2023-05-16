import { Model } from 'mongoose';
import { Etc, EtcDocument } from './schemas/etc.schema';
import { FamilyService } from 'src/family/family.service';
export declare class EtcService {
    private etcModel;
    private familyService;
    constructor(etcModel: Model<EtcDocument>, familyService: FamilyService);
    private googleSheet;
    get2eumPw(): Promise<Etc & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    edit2eumPw(pw: number, updatedAt: number): Promise<boolean>;
    getEtc(code: number): Promise<string>;
    getEtcMonth(code: any, text: any, month: any, nowWeek: any): Promise<boolean>;
    postSheet(code: any, month: any, nowWeek: any, text: any): Promise<import("../family/schemas/family.schema").Family & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
