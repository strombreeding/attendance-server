import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { FightingService } from './fighting.service';

@Controller('fighting')
export class FightingController {
  constructor(private readonly fightService: FightingService) {}

  @Get()
  async getMsgs() {
    return await this.fightService.getMsg();
  }

  @Post()
  async postMsg(@Body() body: { content: string; author: string }) {
    await this.fightService.postMsg(body);
    return true;
  }

  @Patch()
  async likesMsg(@Body('id') id: string) {
    await this.fightService.likesMsg(id);
    return true;
  }
}
