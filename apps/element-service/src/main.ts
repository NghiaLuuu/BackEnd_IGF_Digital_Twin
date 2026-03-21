import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ElementServiceModule } from './element-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import {
  GRPC_ELEMENT_PACKAGE,
  getGrpcElementProtoPath,
  getGrpcElementUrl,
} from '@shared';

async function bootstrap() {
  loadEnv();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ElementServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: String(GRPC_ELEMENT_PACKAGE),
        protoPath: getGrpcElementProtoPath(),
        url: getGrpcElementUrl(),
        loader: {
          keepCase: true,
          arrays: true,
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
}
bootstrap().catch((error) => {
  console.error('Failed to start element-service:', error);
});
