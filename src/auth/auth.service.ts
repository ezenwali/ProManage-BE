import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environmentVariables } from 'src/config/env.variables';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthResponse } from './interfaces';
import { IAuthRepository } from 'src/auth/Presistence/interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { emailEventKey } from 'src/events/key';
import { userType } from 'src/common/interfaces/user.types';
import { AuthUserEntity } from './Base/AuthUserEntity';
import { LoginUserDto, RegisterUserDto } from './dto';
import { SaveVerificationCodeEntity } from './Base/SaveVerificationCodeEntity';
import * as shortid from 'shortid';

@Injectable({})
export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async generateVerificationCode(email: string) {
    const userCode = await this.authRepository.getVerificationCode(email);

    if (userCode) {
      try {
        userCode.updateCode();
        await this.authRepository.updateVerificationCode(userCode);

        this.eventEmitter.emit(emailEventKey.sendOTP, {
          email,
          code: userCode.getCode(),
        });

        return { isSent: true };
      } catch (error) {
        throw error;
      }
    }

    try {
      const userCodeDetials = SaveVerificationCodeEntity.create({
        id: shortid.generate(),
        email,
      });

      await this.authRepository.saveVerificationCode(userCodeDetials);

      this.eventEmitter.emit(emailEventKey.sendOTP, {
        email,
        code: userCodeDetials.getCode(),
      });

      return { isSent: true };
    } catch (error) {
      throw error;
    }
  }

  async login(userDetails: LoginUserDto) {
    let user: AuthUserEntity;

    try {
      user = await this.authRepository.login(userDetails.email);
      if (!user) throw new ForbiddenException('User not found');

      await user.verifyHashedPassword(userDetails.password);
    } catch (error) {
      throw error;
    }
    const token = this.genrate({ id: user.getId(), email: user.getEmail() });

    return { user, token };
  }

  async register(userDetails: RegisterUserDto): Promise<AuthResponse> {
    const { email, password, verificationCode } = userDetails;
    let createdUser: AuthUserEntity;
    try {
      const userCode = await this.authRepository.getVerificationCode(email);

      if (!userCode) {
        throw new NotFoundException('Verification code not found');
      }

      userCode.isInValid(verificationCode);
    } catch (error) {
      throw error;
    }

    try {
      createdUser = AuthUserEntity.create({
        id: shortid.generate(),
        email,
        password,
        createdAt: new Date(),
        userType: 'Email_Password',
      });

      await this.authRepository.register(createdUser);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Email already in use');
      }
      throw error;
    }

    const token = this.genrate({ id: createdUser.getId(), email });
    this.eventEmitter.emit(emailEventKey.welcome, { email });
    return { user: createdUser, token };
  }

  /**
   * Register social account user
   */
  async registerUser(email: string, usertype: keyof typeof userType) {
    const user = AuthUserEntity.create({
      id: shortid.generate(),
      email,
      createdAt: new Date(),
      userType: usertype,
    });

    try {
      await this.authRepository.register(user);
      this.eventEmitter.emit(emailEventKey.welcome, { email });
    } catch (error) {
      throw error;
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<AuthUserEntity | null> {
    return await this.authRepository.login(email);
  }

  private genrate({ email, id }, expires_in?: string): string {
    const payload = {
      id,
      email,
    };

    const opt = {
      secret: environmentVariables.jwt_token.secret,
      expiresIn: expires_in
        ? expires_in
        : environmentVariables.jwt_token.expires_in,
      audience: environmentVariables.jwt_token.audience,
      issuer: environmentVariables.jwt_token.issuer,
    };

    return this.jwtService.sign(payload, opt);
  }
}
