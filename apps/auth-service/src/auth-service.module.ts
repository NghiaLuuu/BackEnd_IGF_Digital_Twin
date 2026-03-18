import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../../libs/database/src';
import { AUTH_REPOSITORY } from './contracts/auth-repository.interface';
import { AuthRpcController } from './controllers/auth-service.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthServiceService } from './services/auth-service.service';
import { PrismaClient as AuthPrismaClient } from '../generated/client';

@Module({
  imports: [
    DatabaseModule.forRoot(AuthPrismaClient),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-auth-secret-change-me',
    }),
  ],
  controllers: [AuthRpcController],
  providers: [
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    AuthServiceService,
  ],
})
export class AuthServiceModule {}
