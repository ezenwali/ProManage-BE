import { BaseEntity } from '../../common/database/entity';
import { userType } from 'src/common/interfaces/user.types';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common';

interface User {
  id: string;
  email: string;
  password?: string;
  createdAt: Date;
  userType: keyof typeof userType;
}

export class AuthUserEntity extends BaseEntity {
  private constructor(
    protected readonly id: string,
    private readonly email: string,
    private readonly password: string,
    private readonly createdAt: Date,
    private readonly _userType: keyof typeof userType,
  ) {
    super(id);
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUserType() {
    return this._userType;
  }

  async getHasedPassword() {
    return await argon.hash(this.password);
  }

  async verifyHashedPassword(password: string) {
    if (this._userType !== 'Email_Password') {
      throw new ForbiddenException(
        'Account not associated with email and password',
      );
    }

    const passwordMatch = await argon.verify(this.password, password);

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }

    return true;
  }

  static create(props: User) {
    if (props.userType === 'Email_Password') {
      return new AuthUserEntity(
        props.id,
        props.email,
        props.password,
        props.createdAt,
        props.userType,
      );
    }
    return new AuthUserEntity(
      props.id,
      props.email,
      '',
      props.createdAt,
      props.userType,
    );
  }
}
