import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as JwtAUthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/common/interfaces/customRequest';

@Injectable()
export class AuthGuard extends JwtAUthGuard('jwt') implements CanActivate {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();

    if (req?.user?.getUserType && req?.user?.getUserType() === 'Google') {
      return req.isAuthenticated();
    }

    return (await super.canActivate(context)) as boolean;
  }
}
