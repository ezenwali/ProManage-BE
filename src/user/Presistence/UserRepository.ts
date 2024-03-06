import { Injectable } from '@nestjs/common';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { AuthUserSchemaFactory } from 'src/auth/Presistence/interfaces/schema/authuser-schema.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserRepository } from './interface';

@Injectable({})
export class UserRepository implements IUserRepository {
  constructor(
    private readonly db: PrismaService,
    private readonly authUserSchemaFactory: AuthUserSchemaFactory,
  ) {}

  async getUsers(): Promise<AuthUserEntity[]> {
    try {
      const usersData = await this.db.user.findMany();
      const users: AuthUserEntity[] = usersData.map((user) =>
        this.authUserSchemaFactory.createFromSchema(user),
      );

      return users;
    } catch (error) {
      throw error;
    }
  }
}
