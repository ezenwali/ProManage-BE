import { Request } from 'express';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

export interface CustomRequest extends Request {
  user: AuthUserEntity;
}
