import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import {
  GRPC_AUTH_PACKAGE,
  GRPC_AUTH_PROTO_PATH,
  GRPC_AUTH_URL,
} from '@shared';

async function bootstrap() {
  loadEnv({ path: resolve(process.cwd(), 'apps/auth-service/.env') });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: String(GRPC_AUTH_PACKAGE),
        protoPath: String(GRPC_AUTH_PROTO_PATH),
        url: String(GRPC_AUTH_URL),
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
  console.error('Failed to start auth-service:', error);
});
