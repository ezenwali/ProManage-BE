import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { CustomRequest } from 'src/common/interfaces/customRequest';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): AuthUserEntity => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();

    return request.user;
  },
);
