/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
