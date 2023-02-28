import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyService } from './family.service';
import { Family, FamilySchema } from './schemas/family.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Family.name, schema: FamilySchema }]),
  ],
  providers: [FamilyService],
  exports: [
    FamilyService,
    MongooseModule.forFeature([{ name: Family.name, schema: FamilySchema }]),
  ],
})
export class FamilyModule {}
