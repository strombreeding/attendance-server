import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getNowWeek } from './utils/utilFuc';

async function bootstrap() {
  console.log(process.env.MONGODB_URL);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
  console.log(getNowWeek());
}
bootstrap();
