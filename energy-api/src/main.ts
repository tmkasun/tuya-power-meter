import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import logger from './utils/logger';

// https://docs.nestjs.com/openapi/types-and-parameters
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Tuya Energy meter API')
    .setDescription('Get granular energy usage')
    .setVersion('1.0')
    .addTag('Energy')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
