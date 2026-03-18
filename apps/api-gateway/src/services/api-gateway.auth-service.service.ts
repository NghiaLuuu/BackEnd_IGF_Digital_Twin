import {
  GatewayTimeoutException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import type { Observable } from 'rxjs';
import { GRPC_AUTH_SERVICE_NAME } from '@shared';
import type {
  GetProfileRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from '@grpc/auth';

type GetProfileInput = {
  targetUserId: string;
  requesterUserId: string;
  requesterRoles: string[];
};

type AuthGrpcService = {
  login(input: LoginRequest): Observable<LoginResponse>;
  getProfile(input: GetProfileRequest): Observable<ProfileResponse>;
};

@Injectable()
export class ApiGatewayAuthService implements OnModuleInit {
  private authService!: AuthGrpcService;

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.authService = this.authClient.getService<AuthGrpcService>(
      String(GRPC_AUTH_SERVICE_NAME),
    );
  }

  async login(input: LoginRequest): Promise<LoginResponse> {
    try {
      return await firstValueFrom(
        this.authService.login(input).pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleAuthError(error);
    }
  }

  async getProfile(input: GetProfileInput): Promise<ProfileResponse> {
    try {
      return await firstValueFrom(
        this.authService
          .getProfile({
            userId: input.targetUserId,
            requesterUserId: input.requesterUserId,
            requesterRoles: input.requesterRoles,
          } satisfies GetProfileRequest)
          .pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleAuthError(error);
    }
  }

  private handleAuthError(error: unknown): never {
    if (this.isTimeoutError(error)) {
      throw new GatewayTimeoutException(
        'auth-service did not respond within 3 seconds',
      );
    }

    throw new InternalServerErrorException('Failed to call auth-service');
  }

  private isTimeoutError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (error as { name?: string }).name === 'TimeoutError';
  }
}
