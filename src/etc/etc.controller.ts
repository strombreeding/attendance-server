import { Body, Query, Controller, Get, Post } from '@nestjs/common';
import { EtcService } from './etc.service';
import * as utils from '../utils/utilFuc';

@Controller('etc')
export class EtcController {
  constructor(private readonly etcService: EtcService) {}

  @Post()
  async postEtc(@Body() body: { name: string; text: string }) {
    const code = utils.getReader(body.name);
    const nowWeek = utils.getNowWeek();
    const date = utils.getDate().month;

    try {
      const workging = await this.etcService.getEtcMonth(
        code,
        body.text,
        date,
        nowWeek,
      );
      const postGoogleSheet = await this.etcService.postSheet(
        code,
        date,
        nowWeek,
        body.text,
      );
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Get()
  async getEtc(@Query('name') name: string) {
    const code = utils.getReader(name);
    const etcToWeek = await this.etcService.getEtc(code);
    return etcToWeek;
  }
  @Get('/2eum')
  async get2eumPw() {
    const pw = await this.etcService.get2eumPw();
    return pw;
  }
  @Post('/2eum')
  async editPw(@Body() body: { pw: number; updatedAt: number }) {
    const { pw, updatedAt } = body;
    const result = await this.etcService.edit2eumPw(pw, updatedAt);
    return result;
  }
}
