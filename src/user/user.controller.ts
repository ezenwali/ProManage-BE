import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/getUser';
import { UserResult } from './dto/user.dto';
import { AuthGuard } from 'src/config/guards/auth.guard';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResult })
  async getUser(@GetUser() user: AuthUserEntity): Promise<UserResult> {
    return {
      id: user.getId(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt(),
      userType: user.getUserType(),
    };
  }
}
