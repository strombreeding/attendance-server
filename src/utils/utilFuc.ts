import { google } from 'googleapis';
import {
  client_email,
  private_key,
} from '../../attendance-377908-a5329d95e55f.json';
const onDays = [0, 1, 6];

export const getNowWeek = () => {
  // 아래는 월별 일요일 날짜와 개수 구하는 것
  const nowDate = getDate();
  const now = new Date().getDay();
  if (onDays.includes(now) === false)
    throw new Error('토,일,월요일 에만 출석부 사용이 가능합니다.');

  const lastDate = new Date(nowDate.year, nowDate.month, 0).getDate();
  console.log(lastDate);
  let weeksCount = 0;
  const zxczxc = [];
  for (let i = 1; i <= lastDate; i++) {
    const day = new Date(nowDate.year, nowDate.month - 1, i).getDay();
    const date = new Date(nowDate.year, nowDate.month - 1, i).getDate();
    const arr = [];
    if (day === 0) {
      // arr 에는 출석부 가능 날짜(date) 가 들어감.
      // 기본적으로 주일+월요일 date 가 들어가는데,
      // 주일을 시작으로 하기 때문에 다음날은 +1 전날은 -1 이런식으로 추가 감소 하면 됨
      arr.push(date - 1);
      arr.push(date);
      if (date + 1 <= lastDate) {
        arr.push(date + 1);
      } else {
        arr.push(1);
      }
      zxczxc.push(arr);
      // weeksCount.push(
      //   `${date}~${date + 1} 일까지 ${weeksCount.length + 1}주차 `,
      // );
    }
  }
  console.log(zxczxc[0].includes(nowDate.date));
  for (let i = 0; i < zxczxc.length; i++) {
    // 27 을 바꾸어야 함 nowDate.date 로
    if (zxczxc[i].includes(nowDate.date)) {
      weeksCount = i + 1;
      break;
    }
  }
  console.log('오늘은', weeksCount, '주차');
  // console.log('주일은 총', weeksCount.length, '번, ', weeksCount);
  // const result = [];
  // for (let i = 0; i < context.data.values.length; i++) {
  //   result.push(context.data.values[i][0]);
  // }
  return weeksCount;
};

export const getColumnNumber = (nowWeek: number) => {
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
export const getColumnNumberForEtc = (nowWeek: number) => {
  let column = '';
  switch (nowWeek) {
    case 1:
      column = 'D';
      break;
    case 2:
      column = 'F';
      break;
    case 3:
      column = 'H';
      break;
    case 4:
      column = 'J';
      break;
    case 5:
      column = 'L';
      break;
  }
  return column;
};

export const getReader = (name: string) => {
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

export const connectGoogleApi = () => {
  const authorize = new google.auth.JWT(client_email, null, private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  // google spread sheet api 가져오기
  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
  });
  return googleSheet;
};

export const getDate = () => {
  const nowDate = new Date();
  const date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate(),
    second: nowDate.getTime(),
  };
  return date;
};

export const makeToUpdate = (
  week: number,
  toUpdate: [string[]],
  name: string,
  stack: number,
) => {
  let isReader = '';
  if (stack === 0) isReader = `${name}가족`;
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

export const setAttendType = (type: {
  code: number;
  type: number | string;
}): {
  code: number;
  type: number | string;
} => {
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
