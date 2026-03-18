import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { AUTH_REPOSITORY } from './contracts/auth-repository.interface';
import { AuthRpcController } from './controllers/auth-service.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthServiceService } from './services/auth-service.service';

@Module({
  imports: [
    DatabaseModule,
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
