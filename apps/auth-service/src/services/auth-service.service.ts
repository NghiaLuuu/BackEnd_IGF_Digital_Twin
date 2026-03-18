import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AUTH_REPOSITORY } from '../contracts/auth-repository.interface';
import type { IAuthRepository } from '../contracts/auth-repository.interface';
import { LoginDto } from '../dto/login.dto';
import { AuthUserModel } from '../models/auth-user.model';

type Profile = {
  userId: string;
  username: string;
  roles: string[];
};

type LoginResult = {
  accessToken: string;
  userId: string;
  username: string;
  roles: string[];
};

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async login(input: LoginDto): Promise<LoginResult> {
    const user: AuthUserModel | null =
      await this.authRepository.findByUsernameAndPassword(
        input.username,
        input.password,
      );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const expiresInSeconds = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 3600);

    const accessToken = sign(
      {
        sub: user.userId,
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET ?? 'dev-auth-secret-change-me',
      { expiresIn: expiresInSeconds },
    );

    return {
      accessToken,
      userId: user.userId,
      username: user.username,
      roles: user.roles,
    };
  }

  async profile(
    userId: string,
    requesterUserId: string,
    requesterRoles: string[],
  ): Promise<Profile> {
    const canReadProfile =
      requesterUserId === userId || requesterRoles.includes('admin');

    if (!canReadProfile) {
      throw new ForbiddenException(
        'You are not allowed to read this user profile',
      );
    }

    const user: AuthUserModel | null =
      await this.authRepository.findByUserId(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.userId,
      username: user.username,
      roles: user.roles,
    };
  }
}
