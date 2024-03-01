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
import { AuthService } from './auth.service';
import {
  GenerateVerificationCodeDto,
  LoginUserDto,
  RegisterUserDto,
  VerificationCodeResult,
} from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from 'src/config/guards/googleAuth.guard';
import { environmentVariables } from 'src/config/env.variables';
import { Response } from 'express';
import { CustomRequest } from 'src/common/interfaces/customRequest';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: VerificationCodeResult })
  @Post('genrate-code')
  @HttpCode(HttpStatus.OK)
  async generateVerificationCode(
    @Body() { email }: GenerateVerificationCodeDto,
  ): Promise<VerificationCodeResult> {
    return await this.authService.generateVerificationCode(email);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const response = await this.authService.login(dto);

    res.cookie('user_token', response.token, {
      expires: new Date(
        Date.now() + Number(environmentVariables.session.sessionaaxAge),
      ),
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiCreatedResponse()
  async register(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const response = await this.authService.register(dto);

    res.cookie('user_token', response.token, {
      expires: new Date(
        Date.now() + Number(environmentVariables.session.sessionaaxAge),
      ),
    });
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
