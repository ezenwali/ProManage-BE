import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import {
  ApiCustomResponse,
  IServiceResponse,
} from 'src/common/interfaces/response.type';
import { AuthGuard } from 'src/config/guards/auth.guard';
import { GetUser } from 'src/decorator/getUser';
import { UserResult } from './dto/user.dto';
import { IUserController } from './interfaces/userController.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCustomResponse(HttpStatus.OK, UserResult)
  async getUser(@GetUser() user: AuthUserEntity) {
    return {
      status: HttpStatus.OK,
      message: 'Current user details',
      data: plainToInstance(UserResult, user),
    };
  }

  @Get('allusers')
  @HttpCode(HttpStatus.OK)
  @ApiCustomResponse(HttpStatus.OK, UserResult, 'array')
  async getAllUsers(
    @GetUser() user: AuthUserEntity,
  ): Promise<IServiceResponse<UserResult[]>> {
    const data = await this.userService.getAllUsers(user);

    return {
      status: HttpStatus.OK,
      message: 'All users',
      data: plainToInstance(UserResult, data),
    };
  }
}
