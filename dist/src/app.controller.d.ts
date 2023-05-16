import { AppService } from './app.service';
import { CreateAttendance } from './types';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    test(): any;
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
