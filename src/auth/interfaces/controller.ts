import { Response } from 'express';
import session from 'express-session';
import { CustomRequest } from 'src/common/interfaces/customRequest';
import { IServiceResponse } from 'src/common/interfaces/response.type';
import { AuthUserEntity } from '../Base/AuthUserEntity';
import {
  GenerateVerificationCodeDto,
  LoginUserDto,
  RegisterUserDto,
  VerificationCodeResult,
} from '../dto';

export interface IAuthController {
  generateVerificationCode(
    dto: GenerateVerificationCodeDto,
  ): Promise<IServiceResponse<VerificationCodeResult>>;
  login(dto: LoginUserDto, res: Response): Promise<IServiceResponse<void>>;
  register(
    dto: RegisterUserDto,
    res: Response,
  ): Promise<IServiceResponse<void>>;
  loginWithGoogle(): Promise<void>;
  googleRedirect(
    req: CustomRequest,
    res: Response,
  ): Promise<AuthUserEntity | (session.Session & Partial<session.SessionData>)>;
}
