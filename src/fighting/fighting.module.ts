import { Module } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { FightingController } from './fighting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fighting, FightingSchema } from './schemas/fighting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Fighting.name, schema: FightingSchema },
    ]),
  ],
  providers: [FightingService],
  controllers: [FightingController],
  exports: [
    FightingService,
    MongooseModule.forFeature([
      { name: Fighting.name, schema: FightingSchema },
    ]),
  ],
})
export class FightingModule {}
