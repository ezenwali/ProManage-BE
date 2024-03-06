import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

export abstract class IUserRepository {
  abstract getUsers(): Promise<AuthUserEntity[]>;
}
