import { NestFactory } from '@nestjs/core';
import { ElementServiceModule } from './element-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import {
  GRPC_ELEMENT_PACKAGE,
  GRPC_ELEMENT_PROTO_PATH,
  GRPC_ELEMENT_URL,
} from '#shared';

async function bootstrap() {
  loadEnv({ path: resolve(process.cwd(), '.env') });
  loadEnv({
    path: resolve(process.cwd(), 'apps/element-service/.env'),
    override: true,
  });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ElementServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: String(GRPC_ELEMENT_PACKAGE),
        protoPath: String(GRPC_ELEMENT_PROTO_PATH),
        url: String(GRPC_ELEMENT_URL),
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
