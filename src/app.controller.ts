import { Body, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as utils from './utils/utilFuc';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    try {
      return await this.appService.getHello();
    } catch (err) {
      console.log(err.message);
      throw new Error(err);
    }
  }
  //

  @Get('/members')
  async getFamilyMembers(@Query('name') name: string) {
    try {
      const familyCode = utils.getReader(name);
      console.log(familyCode);
      const familyLength = await this.appService.getFamilyLength(familyCode);
      console.log('로드 완료,', familyLength);
      const familyMembers = await this.appService.getFamilyMembers(
        familyLength,
      );
      console.log(familyMembers);
      return familyMembers;
    } catch (err) {
      console.log('예외');
      throw new Error(err.message);
    }
  }
  @Get('/post')
  async appendNewFace(
    @Query('newFaceName') newFaceName: string,
    @Query('name') name: string,
  ) {
    const familyCode = utils.getReader(name);
    const familyLength = await this.appService.getFamilyLength(familyCode);
    console.log(familyCode);
    this.appService.appendNewFace(newFaceName, familyLength);
    // 본인 팸코드 B +1
    // 이후 7-팸코드 만큼 반복
    // A , B 각각 +1 씩
    this.appService.plusFamilyLength(familyCode);
    return 'ㅎㅎ';
  }

  @Get('/delete')
  async deleteMember() {
    const name = '진희';
    const target = '안세은';
    const familyCode = utils.getReader(name);
    console.log(familyCode);
    const familyLength = await this.appService.getFamilyLength(familyCode);
    console.log('로드 완료,', familyLength);
    const familyMembers = await this.appService.getFamilyMembers(familyLength);
    console.log(familyMembers);
    const targerIndex = familyMembers.lastIndexOf(target);
    const removeTarget = Number(familyLength[0]) + targerIndex;
    this.appService.deleteMembers(removeTarget, familyCode);
    this.appService.minusFamilyLength(familyCode);
    return 'ㅎㅇ';
  }

  @Get('/test')
  async test() {
    this.appService.test();
    return ' zz';
  }
}
