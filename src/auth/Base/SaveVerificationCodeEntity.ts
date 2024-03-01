import { ForbiddenException } from '@nestjs/common';
import { BaseEntity } from 'src/common/database/entity';

interface verificationCode {
  id: string;
  email: string;
  createdAt?: Date;
  code?: number;
}

export class SaveVerificationCodeEntity extends BaseEntity {
  private readonly verificationCodeExpiration = 30;

  constructor(
    protected readonly id: string,
    private readonly email: string,
    private code: number,
    private createdAt: Date,
  ) {
    super(id);
  }

  getCode() {
    return this.code;
  }

  getEmail() {
    return this.email;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  updateCode() {
    const code = SaveVerificationCodeEntity.genrateCode();

    this.code = code;
    this.createdAt = new Date();
  }

  isInValid(code: string) {
    if (Number(code) !== this.code) {
      throw new ForbiddenException('Invalid verification code');
    }

    const timeDifference =
      (new Date().getTime() - new Date(this.createdAt).getTime()) / (60 * 1000);

    if (timeDifference > this.verificationCodeExpiration) {
      throw new ForbiddenException(
        'Invalid verification code, code expires after 30mins',
      );
    }
  }

  static create(props: verificationCode) {
    const code = props.code
      ? props.code
      : SaveVerificationCodeEntity.genrateCode();

    const date = props.createdAt ? props.createdAt : new Date();

    return new SaveVerificationCodeEntity(props.id, props.email, code, date);
  }

  private static genrateCode() {
    return Math.floor(Math.random() * 10000) + 99999;
  }
}
