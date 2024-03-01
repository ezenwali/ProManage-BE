import { SaveVerificationCodeEntity } from '../../Base/SaveVerificationCodeEntity';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

export abstract class IAuthRepository {
  abstract register(user: AuthUserEntity): Promise<void>;
  abstract findUserById(id: string): Promise<AuthUserEntity>;
  abstract login(email: string): Promise<AuthUserEntity | null>;
  abstract updateVerificationCode(
    code: SaveVerificationCodeEntity,
  ): Promise<void>;
  abstract getVerificationCode(
    email: string,
  ): Promise<SaveVerificationCodeEntity>;
  abstract saveVerificationCode(
    code: SaveVerificationCodeEntity,
  ): Promise<void>;
}
