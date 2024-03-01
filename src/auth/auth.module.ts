import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from 'src/auth/Presistence/AuthRepository';
import { JwtModule } from '@nestjs/jwt';
import { IAuthRepository } from 'src/auth/Presistence/interfaces';
import { PassportModule } from '@nestjs/passport';
import { AuthUserSchemaFactory } from 'src/auth/Presistence/interfaces/schema/authuser-schema.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveVerificationCodeSchemaFactory } from './Presistence/interfaces/schema/verificationCode.schema.factory';
import { GoogleStrategy, JwtStrategy, SessionSerializer } from './strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: IAuthRepository, useClass: AuthRepository },
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
    AuthUserSchemaFactory,
    PrismaService,
    SaveVerificationCodeSchemaFactory,
  ],
})
export class AuthModule {}
