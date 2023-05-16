import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAttendance } from './types';
import * as utils from './utils/utilFuc';

let working = false;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // @Get('/')
  // async setApp(
  //   @Query('year') year: number,
  //   @Query('name') name: string,
  //   @Query('start') start: number,
  //   @Query('end') end: number,
  //   @Query('members') members: string,
  // ) {
  //   const memberArr = members.split(',');
  //   const code = utils.getReader(name);
  //   console.log(code);
  //   await this.appService.createSetApp(name, code, year, start, end, memberArr);
  //   // await this.appService.zz();
  //   return 'clear';
  // }
  @Get()
  test() {
    const qs = require('qs');
    const query = qs.stringify(
      {
        populate: ['categories', 'kimozzi'],
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );
    console.log(query);
    return query;
  }

  @Get('/members')
  async getFamily(@Query('name') name: string) {
    console.log('들어옴?');
    try {
      const familyCode = utils.getReader(name);
      const date = utils.getDate().month;
      const familyInfo = await this.appService.getFamilyInfo(familyCode, date);
      const attendanceInfo = await this.appService.getAttendInfo(
        familyCode,
        date,
      );
      if (!attendanceInfo) {
        return { familyInfo, attendanceInfo: null };
      }
      return { familyInfo, attendanceInfo };
    } catch (err) {
      console.log('예외');
      throw new Error(err.message);
    }
  }
  // @Get('/attendances')
  // async getAttendance(@Query('name') name: string) {
  //   console.log('들어옴?');
  //   try {
  //     const familyCode = utils.getReader(name);
  //     const date = utils.getDate().month;

  //     return attendanceInfo;
  //   } catch (err) {
  //     console.log('예외');
  //     throw new Error(err.message);
  //   }
  // }

  @Post('/members')
  async appendNewFace(
    @Body('newFaceName') newFaceName: string,
    @Body('name') name: string,
  ) {
    const now = Date.now();
    if (working === true) {
      return '다른 작업이 처리 중입니다. 잠시후에 다시 시도해 주세요';
    }
    const date = utils.getDate().month;

    working = true;
    try {
      const familyCode = utils.getReader(name);
      const familyInfo = await this.appService.getFamilyInfo(familyCode, date);
      const arr = [];
      arr.push(familyInfo.startLength);
      arr.push(familyInfo.endLength);
      await Promise.all([
        this.appService.appendNewMember(newFaceName, arr),
        this.appService.plusFamilyLength(familyCode, newFaceName),
      ]);
      console.log(Date.now() - now, '밀리초 걸림');
      return 'ㅎㅎ';
    } catch (err) {
      return err.message;
    } finally {
      working = false;
    }
  }

  @Delete('/members')
  async deleteMember(
    @Body('name') name: string,
    @Body('target') target: string,
  ) {
    if (working === true) {
      return '다른 작업이 처리 중입니다. 잠시후에 다시 시도해 주세요';
    }

    const now = Date.now();

    try {
      const familyCode = utils.getReader(name);
      await Promise.all([
        this.appService.deleteMembers(target, familyCode),
        this.appService.minusFamilyLength(familyCode, target),
      ]);
      console.log(Date.now() - now, '초 걸림');
      return 'ㅎㅇ';
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, 400);
    } finally {
      working = false;
    }
  }
  //
  @Get('/sheetIds')
  async getSheetIds() {
    const a = await this.appService.getSheetIds();
    return a;
    return ' zz';
  }

  @Post('/attendance')
  async attendance(@Body() data: CreateAttendance) {
    console.log(data);
    const date = utils.getDate().month;
    const familyCode = utils.getReader(data.name);

    const familyInfo = await this.appService.getFamilyInfo(familyCode, date);
    const nowWeek = utils.getNowWeek();
    console.log('gdwegegwegwgewgegewweg');
    const result = await this.appService.postAttendance(
      data,
      nowWeek,
      familyInfo,
    );
    return result;
  }

  @Patch('/attendance')
  async complateAttendance() {
    // await this.appService.complateAttendance();
    // return true;
  }

  @Get('/password')
  sendPassword() {
    return '2580#';
  }
  @Get('/version')
  async getVersion() {
    const version = await this.appService.getVersion();
    return version;
  }
}
