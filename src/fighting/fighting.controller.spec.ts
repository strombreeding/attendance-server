import { Test, TestingModule } from '@nestjs/testing';
import { FightingController } from './fighting.controller';

describe('FightingController', () => {
  let controller: FightingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FightingController],
    }).compile();

    controller = module.get<FightingController>(FightingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
