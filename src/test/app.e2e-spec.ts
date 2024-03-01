import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { _session } from 'src/common/app';
import * as passport from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { emailEventKey } from 'src/events/key';

describe('App E2E test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let eventEmitter: EventEmitter2;

  const port = 3030;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(_session);
    app.use(passport.initialize());
    app.use(passport.session());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    eventEmitter = app.get(EventEmitter2);
    prismaService = app.get(PrismaService);

    await prismaService.cleanDatabase();
    await app.listen(port);
    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Authenticate user with email and password', () => {
    const password = 'Shedrach3030';
    const email = 'shedrach3030@gmail.com';
    let verificationCode: string;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Should get code send to email', async () => {
      const onSpy = jest
        .spyOn(eventEmitter, 'emit')
        .mockImplementation((event, payload) => {
          if (event == emailEventKey.sendOTP) {
            verificationCode = payload.code?.toString();
          }

          return true;
        });

      const result = await pactum
        .spec()
        .post('/auth/genrate-code')
        .withJson({ email });

      expect(result.statusCode).toBe(200);
      expect(result.body).toHaveProperty('isSent');
      expect(onSpy).toHaveBeenCalledWith(
        emailEventKey.sendOTP,
        expect.anything(),
      );

      expect(verificationCode).toBeDefined();
    });

    it('Should throw error if DTO to register user is wrong', async () => {
      const result = await pactum
        .spec()
        .post('/auth/register')
        .withJson({ email });

      expect(result.statusCode).toBe(400);
    });

    it('Should register user', async () => {
      const result = await pactum.spec().post('/auth/register').withBody({
        email,
        password,
        verificationCode,
      });

      expect(result.statusCode).toBe(201);
      expect(result.headers).toHaveProperty('set-cookie');
    });

    it('Should throw error if user already exists', async () => {
      const result = await pactum.spec().post('/auth/register').withBody({
        email,
        password,
        verificationCode,
      });

      expect(result.statusCode).toBe(403);
      expect(result.body.message).toBe('Email already in use');
    });

    it('Should login', async () => {
      const result = await pactum.spec().post('/auth/login').withBody({
        email,
        password,
      });

      expect(result.statusCode).toBe(200);
      expect(result.headers).toHaveProperty('set-cookie');
    });
  });
});
