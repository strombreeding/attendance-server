import {google} from "googleapis";
import {client_email, private_key} from "../../attendance-377908-a5329d95e55f.json"


export const getReader = (name:string)=>{
    const useFulReaderName = [
        "지훈","영은","수민","진실","예은","수정","주연","진희","재운",
        "동욱","혜성","정현","현승","주영","상현","예람","민지","세은"
    ]
    console.log(name,useFulReaderName.includes(name))
    if(useFulReaderName.includes(name)!==true)throw new Error("리더이름 제대로 입력 부탁함")
    let code = null;
    switch (name){
        case "지훈" :
        case "영은" :
            code = 1
            break;
        case "수민":
        case "진실":
        case "예은":
            code = 2
            break;
        case "수정": 
        case "주연":
            code = 3
            break;
        case "진희":
        case "재운": 
        case "동욱":
            code = 4
            break;
        case "혜성":
        case "정현":
        case "현승":
            code = 5
            break;
        case "주영":
        case "상현":
        case "예람":
            code = 6
            break;
        case "민지":
        case "세은":
            code = 7
            break;
    }
    return code
}

export const connectGoogleApi = () =>{
    const authorize = new google.auth.JWT(client_email, null, private_key, [
        'https://www.googleapis.com/auth/spreadsheets',
      ]);
      // google spread sheet api 가져오기
      const googleSheet =  google.sheets({
        version: 'v4',
        auth: authorize,
      });
      return googleSheet
}

export const getDate = ()=>{
    const nowDate = new Date()
    const date = {
      year : nowDate.getFullYear(),
      month : nowDate.getMonth()+1,
      date : nowDate.getDate()
    }
    return date
}