import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { FightingService } from './fighting.service';

@Controller('fighting')
export class FightingController {
  constructor(private readonly fightService: FightingService) {}

  @Get()
  async getMsgs() {
    console.log('파이팅 겟');
    return await this.fightService.getMsg();
  }

  @Post()
  async postMsg(@Body() body: { content: string; author: string }) {
    console.log('파이팅 포스트 들어옴');
    await this.fightService.postMsg(body);
    return true;
  }

  @Patch('/likes')
  async likesMsg(@Body() body: { id: string; liker: string }) {
    const { id, liker } = body;
    await this.fightService.likesMsg(id, liker);
    return true;
  }
}
