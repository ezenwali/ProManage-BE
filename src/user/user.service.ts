import { Injectable } from '@nestjs/common';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

@Injectable({})
export class UserService {
  async getAllUsers(currentUserID: string): Promise<AuthUserEntity[]> {
    return null;
  }
}
