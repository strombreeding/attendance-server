import { Module } from '@nestjs/common';
import { EtcService } from './etc.service';
import { EtcController } from './etc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Etc, EtcSchema } from './schemas/etc.schema';
import { FamilyModule } from 'src/family/family.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Etc.name, schema: EtcSchema }]),
    FamilyModule,
  ],
  providers: [EtcService],
  controllers: [EtcController],
  exports: [
    EtcService,
    MongooseModule.forFeature([{ name: Etc.name, schema: EtcSchema }]),
  ],
})
export class EtcModule {}
