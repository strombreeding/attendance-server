export declare const getNowWeek: () => number;
export declare const getColumnNumber: (nowWeek: number) => string;
export declare const getColumnNumberForEtc: (nowWeek: number) => string;
export declare const getReader: (name: string) => any;
export declare const connectGoogleApi: () => import("googleapis").sheets_v4.Sheets;
export declare const getDate: () => {
    year: number;
    month: number;
    date: number;
    second: number;
};
export declare const makeToUpdate: (week: number, toUpdate: [string[]], name: string, stack: number) => void;
export declare const setAttendType: (type: {
    code: number;
    type: number | string;
}) => {
    code: number;
    type: number | string;
};
