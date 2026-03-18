import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayAuthServiceController } from './controllers/api-gateway.auth-service.controller';
import { ApiGatewayElementServiceController } from './controllers/api-gateway.element-service.controller';
import { ApiGatewayProjectServiceController } from './controllers/api-gateway.project-service.controller';
import { ApiGatewayAuthService } from './services/api-gateway.auth-service.service';
import { ApiGatewayElementService } from './services/api-gateway.element-service.service';
import { ApiGatewayProjectService } from './services/api-gateway.project-service.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import {
  GRPC_AUTH_PACKAGE,
  GRPC_AUTH_PROTO_PATH,
  GRPC_AUTH_URL,
  GRPC_ELEMENT_PACKAGE,
  GRPC_ELEMENT_PROTO_PATH,
  GRPC_ELEMENT_URL,
  GRPC_PROJECT_PACKAGE,
  GRPC_PROJECT_PROTO_PATH,
  GRPC_PROJECT_URL,
} from '@shared';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-auth-secret-change-me',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
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
      {
        name: 'PROJECT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: String(GRPC_PROJECT_PACKAGE),
          protoPath: String(GRPC_PROJECT_PROTO_PATH),
          url: String(GRPC_PROJECT_URL),
          loader: {
            keepCase: true,
            arrays: true,
          },
        },
      },
      {
        name: 'ELEMENT_SERVICE',
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
    ]),
  ],
  controllers: [
    ApiGatewayAuthServiceController,
    ApiGatewayElementServiceController,
    ApiGatewayProjectServiceController,
  ],
  providers: [
    ApiGatewayAuthService,
    ApiGatewayElementService,
    ApiGatewayProjectService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class ApiGatewayModule {}
