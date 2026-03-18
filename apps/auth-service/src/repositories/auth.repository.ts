import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database';
import { PrismaClient as AuthPrismaClient } from '@gen-auth/client';
import { IAuthRepository } from '../contracts/auth-repository.interface';
import { AuthUserModel } from '../models/auth-user.model';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly db: PrismaService<AuthPrismaClient>) {}

  async findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<AuthUserModel | null> {
    const users = await this.db.client.$queryRaw<
      Array<{ user_id: string; username: string; roles: string[] }>
    >`
      SELECT user_id, username, roles
      FROM auth_users
      WHERE username = ${username}
        AND password = crypt(${password}, password)
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return null;
    }

    return {
      userId: user.user_id,
      username: user.username,
      roles: user.roles,
    };
  }

  async findByUserId(userId: string): Promise<AuthUserModel | null> {
    const user = await this.db.client.authUser.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        roles: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
