import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamilyModule } from './family/family.module';
import * as redisStore from 'cache-manager-redis-store';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyService } from './family/family.service';
import { EtcModule } from './etc/etc.module';
import { FightingModule } from './fighting/fighting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        ttl: 10000,
        url: process.env.REDIS_URL,
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    FamilyModule,
    EtcModule,
    FightingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`redis[s]://[[default][:password]@][host][:port][/db-number]`;
