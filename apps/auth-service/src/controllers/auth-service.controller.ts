import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthServiceService } from '../services/auth-service.service';
import { GRPC_AUTH_SERVICE_NAME } from '@shared';
import { LoginDto } from '../dto/login.dto';
import { ProfileDto } from '../dto/profile.dto';

@Controller()
export class AuthRpcController {
  constructor(private readonly authService: AuthServiceService) {}

  @GrpcMethod(String(GRPC_AUTH_SERVICE_NAME), 'Login')
  login(payload: LoginDto) {
    return this.authService.login(payload);
  }

  @GrpcMethod(String(GRPC_AUTH_SERVICE_NAME), 'GetProfile')
  profile(payload: ProfileDto) {
    return this.authService.profile(
      payload.userId,
      payload.requesterUserId,
      payload.requesterRoles,
    );
  }
}
