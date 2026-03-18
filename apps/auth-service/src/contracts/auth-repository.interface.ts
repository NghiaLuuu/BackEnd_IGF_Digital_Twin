import { AuthUserModel } from '../models/auth-user.model';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface IAuthRepository {
  findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<AuthUserModel | null>;
  findByUserId(userId: string): Promise<AuthUserModel | null>;
}
