import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IAuthRepository } from './interfaces';
import { SaveVerificationCodeEntity } from '../Base/SaveVerificationCodeEntity';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { AuthUserSchemaFactory } from './interfaces/schema/authuser-schema.factory';
import { SaveVerificationCodeSchemaFactory } from './interfaces/schema/verificationCode.schema.factory';

@Injectable({})
export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly db: PrismaService,
    private readonly authUserSchemaFactory: AuthUserSchemaFactory,
    private readonly verificationCodeSchemaFactory: SaveVerificationCodeSchemaFactory,
  ) {}

  async saveVerificationCode(codeDetails: SaveVerificationCodeEntity) {
    await this.db.userVerificationCode.create({
      data: this.verificationCodeSchemaFactory.create(codeDetails),
    });
  }

  async getVerificationCode(email: string) {
    const userCodeDetails = await this.db.userVerificationCode.findFirst({
      where: { email: email },
    });

    if (!userCodeDetails) {
      return null;
    }

    return this.verificationCodeSchemaFactory.createFromSchema(userCodeDetails);
  }

  async findUserByEmail(email: string) {
    return await this.findUser(email);
  }

  async updateVerificationCode(codeDetails: SaveVerificationCodeEntity) {
    await this.db.userVerificationCode.update({
      where: { email: codeDetails.getEmail() },
      data: this.verificationCodeSchemaFactory.create(codeDetails),
    });
  }

  async login(email: string) {
    return await this.findUser(email);
  }

  async register(user: AuthUserEntity) {
    const data = await this.authUserSchemaFactory.create(user);

    await this.db.user.create({
      data,
    });
  }

  private async findUser(email: string) {
    try {
      const user = await this.db.user.findFirst({
        where: { email },
      });
      if (user) {
        return this.authUserSchemaFactory.createFromSchema(user);
      }
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.db.user.findFirst({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      return this.authUserSchemaFactory.createFromSchema(user);
    } catch (error) {
      throw error;
    }
  }
}
