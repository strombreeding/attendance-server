"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttendType = exports.makeToUpdate = exports.getDate = exports.connectGoogleApi = exports.getReader = exports.getColumnNumberForEtc = exports.getColumnNumber = exports.getColumnNumberz = exports.getNowWeek = void 0;
const googleapis_1 = require("googleapis");
const attendance_377908_a5329d95e55f_json_1 = require("../../attendance-377908-a5329d95e55f.json");
const onDays = [0, 1, 2, 3, 4, 5];
const getNowWeek = () => {
    const nowDate = (0, exports.getDate)();
    const now = new Date().getDay();
    if (onDays.includes(now) === false)
        throw new Error('일~금요일 에만 출석부 사용이 가능합니다.');
    const lastDate = new Date(nowDate.year, nowDate.month, 0).getDate();
    console.log(lastDate);
    let weeksCount = 0;
    const zxczxc = [];
    for (let i = 1; i <= lastDate; i++) {
        const day = new Date(nowDate.year, nowDate.month - 1, i).getDay();
        const date = new Date(nowDate.year, nowDate.month - 1, i).getDate();
        const arr = [];
        if (day === 0) {
            arr.push(date);
            let count = 1;
            let surveCount = 1;
            while (count < 6) {
                console.log('현재 카운트 = ', count);
                if (date + count <= lastDate) {
                    arr.push(date + count);
                }
                else {
                    arr.push(surveCount);
                    ++surveCount;
                }
                ++count;
            }
            zxczxc.push(arr);
        }
    }
    console.log('출석가능 요일 => ', zxczxc);
    for (let i = 0; i < zxczxc.length; i++) {
        if (zxczxc[i].includes(nowDate.date)) {
            weeksCount = i + 1;
            break;
        }
    }
    console.log('오늘은', weeksCount, '주차');
    return weeksCount;
};
exports.getNowWeek = getNowWeek;
const getColumnNumberz = (nowWeek) => {
    let column = '';
    switch (nowWeek) {
        case 1:
            column = 'C';
            break;
        case 2:
            column = 'E';
            break;
        case 3:
            column = 'G';
            break;
        case 4:
            column = 'I';
            break;
        case 5:
            column = 'K';
            break;
    }
    return column;
};
exports.getColumnNumberz = getColumnNumberz;
const getColumnNumber = (nowWeek) => {
    let column = {
        attend: '',
        pray: '',
    };
    switch (nowWeek) {
        case 1:
            column.attend = 'C';
            column.pray = 'D';
            break;
        case 2:
            column.attend = 'F';
            column.pray = 'G';
            break;
        case 3:
            column.attend = 'I';
            column.pray = 'J';
            break;
        case 4:
            column.attend = 'L';
            column.pray = 'M';
            break;
        case 5:
            column.attend = 'O';
            column.pray = 'P';
            break;
    }
    return column;
};
exports.getColumnNumber = getColumnNumber;
const getColumnNumberForEtc = (nowWeek) => {
    let column = '';
    switch (nowWeek) {
        case 1:
            column = 'E';
            break;
        case 2:
            column = 'H';
            break;
        case 3:
            column = 'K';
            break;
        case 4:
            column = 'N';
            break;
        case 5:
            column = 'Q';
            break;
    }
    return column;
};
exports.getColumnNumberForEtc = getColumnNumberForEtc;
const getReader = (name) => {
    const useFulReaderName = [
        '지훈',
        '영은',
        '수민',
        '진실',
        '예은',
        '수정',
        '주연',
        '진희',
        '재운',
        '동욱',
        '혜성',
        '정현',
        '현승',
        '주영',
        '상현',
        '예람',
        '민지',
        '세은',
    ];
    console.log(name, useFulReaderName.includes(name));
    if (useFulReaderName.includes(name) !== true)
        throw new Error('리더이름 제대로 입력 부탁함');
    let code = null;
    switch (name) {
        case '지훈':
        case '영은':
        case '김원':
            code = 1;
            break;
        case '수민':
        case '진실':
        case '예은':
            code = 2;
            break;
        case '수정':
        case '주연':
            code = 3;
            break;
        case '진희':
        case '재운':
        case '동욱':
            code = 4;
            break;
        case '혜성':
        case '정현':
        case '현승':
            code = 5;
            break;
        case '주영':
        case '상현':
        case '예람':
            code = 6;
            break;
        case '민지':
        case '세은':
            code = 7;
            break;
    }
    return code;
};
exports.getReader = getReader;
const connectGoogleApi = () => {
    const authorize = new googleapis_1.google.auth.JWT(attendance_377908_a5329d95e55f_json_1.client_email, null, attendance_377908_a5329d95e55f_json_1.private_key, [
        'https://www.googleapis.com/auth/spreadsheets',
    ]);
    const googleSheet = googleapis_1.google.sheets({
        version: 'v4',
        auth: authorize,
    });
    return googleSheet;
};
exports.connectGoogleApi = connectGoogleApi;
const getDate = () => {
    const nowDate = new Date();
    const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
        second: nowDate.getTime(),
    };
    return date;
};
exports.getDate = getDate;
const makeToUpdate = (week, toUpdate, name, stack) => {
    let isReader = '';
    if (stack === 0)
        isReader = `${name}가족`;
    switch (week) {
        case 1:
            toUpdate.push([isReader, name, '✅']);
            break;
        case 2:
            toUpdate.push([isReader, name, '✅', '✅']);
            break;
        case 3:
            toUpdate.push([isReader, name, '✅', '✅', '✅']);
            break;
        case 4:
            toUpdate.push([isReader, name, '✅', '✅', '✅', '✅']);
            break;
        case 5:
            toUpdate.push([isReader, name, '✅', '✅', '✅', '✅', '✅']);
            break;
    }
};
exports.makeToUpdate = makeToUpdate;
const setAttendType = (type) => {
    switch (type.type) {
        case 1:
            type.type = '🟢';
            break;
        case 2:
            type.type = '🟡';
            break;
        default:
            type.type = '🔴';
    }
    return type;
};
exports.setAttendType = setAttendType;
//# sourceMappingURL=utilFuc.js.map