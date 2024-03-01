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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CustomRequest } from 'src/common/interfaces/customRequest';
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

  @ApiCreatedResponse({ type: VerificationCodeResult })
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
  @ApiOkResponse()
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
  @ApiCreatedResponse()
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
      status: 200,
      message: 'Login successful',
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async loginWithGoogle() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req: CustomRequest, @Res() res: Response) {
    console.log('here redirect');

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
