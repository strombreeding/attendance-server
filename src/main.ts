import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getNowWeek } from './utils/utilFuc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
  console.log(getNowWeek());
}
bootstrap();
