import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ProjectServiceModule } from './project-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import {
  GRPC_PROJECT_PACKAGE,
  getGrpcProjectProtoPath,
  getGrpcProjectUrl,
} from '@shared';

async function bootstrap() {
  loadEnv();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: String(GRPC_PROJECT_PACKAGE),
        protoPath: getGrpcProjectProtoPath(),
        url: getGrpcProjectUrl(),
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
  console.error('Failed to start project-service:', error);
});
