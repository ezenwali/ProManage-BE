import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const activate = (await super.canActivate(context)) as boolean;
      const request = context.switchToHttp().getRequest();
      console.log('can activate');

      await super.logIn(request);
      return activate;
    } catch (error) {
      throw error;
    }
  }
}
