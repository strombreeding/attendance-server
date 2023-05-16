import { EtcService } from './etc.service';
export declare class EtcController {
    private readonly etcService;
    constructor(etcService: EtcService);
    postEtc(body: {
        name: string;
        text: string;
    }): Promise<boolean>;
    getEtc(name: string): Promise<string>;
    get2eumPw(): Promise<import("./schemas/etc.schema").Etc & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    editPw(body: {
        pw: number;
    }): Promise<boolean>;
}
