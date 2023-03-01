import { EtcService } from './etc.service';
export declare class EtcController {
    private readonly etcService;
    constructor(etcService: EtcService);
    postEtc(body: {
        name: string;
        text: string;
    }): Promise<boolean>;
    getEtc(name: string): Promise<string>;
}
