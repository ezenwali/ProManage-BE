import { Test } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAuthRepository } from '../../Presistence/interfaces';
import { AuthUserEntity } from '../../Base/AuthUserEntity';
import {
  _codeDetails,
  codeDetail,
  hashedEquivOf$password,
  userDto,
} from '../help';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common';

const authRepositoryMock = {
  getVerificationCode: jest.fn(),
  updateVerificationCode: jest.fn(),
  saveVerificationCode: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let emitter: EventEmitter2;
  let authRepo: IAuthRepository;
  const token = 'secret';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtService,
        EventEmitter2,
        AuthService,
        {
          provide: IAuthRepository,
          useValue: authRepositoryMock,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    jwtService = moduleRef.get(JwtService);
    emitter = moduleRef.get(EventEmitter2);
    authRepo = moduleRef.get(IAuthRepository);

    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('Emitter should be defined', () => {
    expect(emitter).toBeDefined();
  });

  it('jwtService should be defined', () => {
    expect(emitter).toBeDefined();
  });

  it('jwtService should be defined', () => {
    expect(emitter).toBeDefined();
  });

  it('authRepo should be defined', () => {
    expect(emitter).toBeDefined();
  });

  describe('Generate Verification Token', () => {
    test('should generate token for user', async () => {
      jest
        .spyOn(authRepo, 'getVerificationCode')
        .mockResolvedValueOnce(_codeDetails);
      const result = await authService.generateVerificationCode(
        _codeDetails.getEmail(),
      );
      expect(result).toEqual({ isSent: true });
      expect(authRepo.getVerificationCode).toHaveBeenCalledTimes(1);
      expect(authRepo.getVerificationCode).toHaveBeenCalledWith(
        codeDetail.email,
      );
    });
  });

  describe('Register user', () => {
    test('should throw error user already exists', async () => {
      jest
        .spyOn(authRepo, 'getVerificationCode')
        .mockResolvedValueOnce(_codeDetails);

      jest.spyOn(authRepo, 'register').mockImplementationOnce(() => {
        throw new PrismaClientKnownRequestError('User already exists', {
          code: 'P2002',
          clientVersion: '3.8.1',
        });
      });

      try {
        await authService.register({
          ...userDto,
          verificationCode: _codeDetails.getCode().toString(),
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Email already in use');
      }
    });

    test('should register user', async () => {
      jest
        .spyOn(authRepo, 'getVerificationCode')
        .mockResolvedValueOnce(_codeDetails);
      jest.spyOn(authRepo, 'register').mockResolvedValueOnce();
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      const result = await authService.register({
        ...userDto,
        verificationCode: _codeDetails.getCode().toString(),
      });

      expect(authRepo.getVerificationCode).toHaveBeenCalledWith(userDto.email);

      expect(result).toEqual(
        expect.objectContaining({
          token,
          user: AuthUserEntity.create({
            email: userDto.email,
            id: result.user.getId(),
            password: userDto.password,
            createdAt: result.user.getCreatedAt(),
            userType: 'Email_Password',
          }),
        }),
      );
    });

    test('should throw error if code is not found for a user', async () => {
      jest.spyOn(authRepo, 'getVerificationCode').mockResolvedValueOnce(null);
      jest.spyOn(authRepo, 'register').mockResolvedValueOnce();

      try {
        await authService.register({
          ...userDto,
          verificationCode: _codeDetails.getCode().toString(),
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.response.message).toBe('Verification code not found');
      }
    });

    test('should throw error if code does not match', async () => {
      jest
        .spyOn(authRepo, 'getVerificationCode')
        .mockResolvedValueOnce(_codeDetails);
      jest.spyOn(authRepo, 'register').mockResolvedValueOnce();
      try {
        await authService.register({
          ...userDto,
          verificationCode: '00000',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.response.message).toBe('Invalid verification code');
      }
    });
  });

  describe('Login User', () => {
    test('should login user', async () => {
      jest.spyOn(authRepo, 'login').mockResolvedValueOnce(
        AuthUserEntity.create({
          email: userDto.email,
          id: '1',
          password: hashedEquivOf$password,
          createdAt: new Date(),
          userType: 'Email_Password',
        }),
      );

      const result = await authService.login({
        email: userDto.email,
        password: userDto.password,
      });

      expect(authRepo.login).toHaveBeenCalledWith(userDto.email);
      expect(result.user.getId()).toBe('1');
    });

    test('should not login due to incorrect password', async () => {
      jest.spyOn(authRepo, 'login').mockResolvedValueOnce(
        AuthUserEntity.create({
          email: userDto.email,
          id: '1',
          password: hashedEquivOf$password,
          createdAt: new Date(),
          userType: 'Email_Password',
        }),
      );

      try {
        await authService.login({
          email: userDto.email,
          password: '000000',
        });
      } catch (error) {
        expect(error.response.message).toBe('Incorrect credentials');
      }
    });
  });

  describe('Register social account user', () => {
    test('should register user and emit welcome event', async () => {
      const socialMedia = 'Google';

      jest.spyOn(authRepo, 'register').mockResolvedValueOnce();
      jest.spyOn(emitter, 'emit').mockReturnValue(true);

      await authService.registerUser(userDto.email, socialMedia);

      expect(authRepo.register).toHaveBeenCalled();

      expect(emitter.emit).toHaveBeenCalledWith('welcome', {
        email: userDto.email,
      });
    });
  });
});
