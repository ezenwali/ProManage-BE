import { Injectable } from '@nestjs/common';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { IUserRepository } from './Presistence/interface';

@Injectable({})
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}
  async getAllUsers(currentUser: AuthUserEntity): Promise<AuthUserEntity[]> {
    const users = await this.userRepository.getUsers();

    return users.filter((user) => !user.equalsTo(currentUser));
  }
}
