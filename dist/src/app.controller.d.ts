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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { AppService } from './app.service';
import { CreateAttendance } from './types';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getFamily(name: string): Promise<{
        familyInfo: import("./family/schemas/family.schema").Family & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
        attendanceInfo: any[][];
    }>;
    appendNewFace(newFaceName: string, name: string): Promise<any>;
    deleteMember(name: string, target: string): Promise<"다른 작업이 처리 중입니다. 잠시후에 다시 시도해 주세요" | "ㅎㅇ">;
    getSheetIds(): Promise<void | " zz">;
    attendance(data: CreateAttendance): Promise<void>;
    complateAttendance(): Promise<void>;
    sendPassword(): string;
    getVersion(): Promise<any>;
}
