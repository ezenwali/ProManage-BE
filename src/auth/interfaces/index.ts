import { AuthUserEntity } from '../Base/AuthUserEntity';

export interface AuthResponse {
  user: AuthUserEntity;
  token: string;
}

export type Done = (err: Error, user: any) => void;
