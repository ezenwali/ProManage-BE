import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CustomRequest } from 'src/common/interfaces/customRequest';
import { ApiCustomResponse } from 'src/common/interfaces/response.type';
import { environmentVariables } from 'src/config/env.variables';
import { GoogleAuthGuard } from 'src/config/guards/googleAuth.guard';
import { AuthService } from './auth.service';
import {
  GenerateVerificationCodeDto,
  LoginUserDto,
  RegisterUserDto,
  VerificationCodeResult,
} from './dto';
import { IAuthController } from './interfaces/controller';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCustomResponse(HttpStatus.CREATED, VerificationCodeResult)
  @Post('genrate-code')
  @HttpCode(HttpStatus.OK)
  async generateVerificationCode(
    @Body() { email }: GenerateVerificationCodeDto,
  ) {
    const response = await this.authService.generateVerificationCode(email);

    return {
      status: HttpStatus.OK,
      message: 'Code sent',
      data: response,
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiCustomResponse(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(dto);

    res.cookie('user_token', response.token, {
      expires: new Date(
        Date.now() + Number(environmentVariables.session.sessionaaxAge),
      ),
    });

    return {
      status: 200,
      message: 'Login successful',
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiCustomResponse(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.register(dto);

    res.cookie('user_token', response.token, {
      expires: new Date(
        Date.now() + Number(environmentVariables.session.sessionaaxAge),
      ),
    });

    return {
      status: HttpStatus.OK,
      message: 'Registration successful',
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async loginWithGoogle() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req: CustomRequest, @Res() res: Response) {
    if (req.user && req.user.getUserType() == 'Google') {
      res.redirect(environmentVariables.frontEndUrl);

      return req.user;
    }

    return req.session.destroy(() => {
      res.redirect(
        `${environmentVariables.frontEndUrl}/auth/login/login-failed`,
      );
    });
  }
}
