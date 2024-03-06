import { Module } from '@nestjs/common';
import { AuthUserSchemaFactory } from 'src/auth/Presistence/interfaces/schema/authuser-schema.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './Presistence/UserRepository';
import { IUserRepository } from './Presistence/interface';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    { provide: IUserRepository, useClass: UserRepository },
    AuthUserSchemaFactory,
    PrismaService,
  ],
})
export class UserModule {}
