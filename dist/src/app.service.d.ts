import { Cache } from 'cache-manager';
import { FamilyService } from './family/family.service';
import { Family } from './family/schemas/family.schema';
import { CreateAttendance } from './types';
export declare class AppService {
    private familyService;
    private readonly cacheManager;
    constructor(familyService: FamilyService, cacheManager: Cache);
    private googleSheet;
    getFamilyInfo(code: number, month?: number): Promise<Family & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAttendInfo(code: number, month?: number): Promise<any[][]>;
    appendNewMember(newFaceName: any, arr: any): Promise<boolean>;
    deleteMembers(target: string, code: number): Promise<void>;
    plusFamilyLength(code: number, newMember?: string): Promise<boolean>;
    minusFamilyLength(code: number, targetName: string): Promise<boolean>;
    postAttendance(data: CreateAttendance, nowWeek: number, info: Family): Promise<void>;
    getSheetIds(): Promise<void>;
    append(range: any, insertDataOption: any, values: any): Promise<void>;
    appendNewFace(newFaceName: string, arr: Array<string>, i: number): Promise<boolean>;
    complateAttendance(): Promise<void>;
    getVersion(): Promise<any>;
}
