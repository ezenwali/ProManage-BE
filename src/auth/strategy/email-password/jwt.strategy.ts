import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environmentVariables } from 'src/config/env.variables';
import { AuthService } from '../../auth.service';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: environmentVariables.jwt_token.secret,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    /**
     * TODO:Find a way to Get cookies as array of strings
     */
    const tokens = req.get('cookie');
    if (tokens) {
      const token = tokens
        .split(';')
        .filter((item) => item.includes('user_token'));

      if (token.length < 1) {
        return null;
      }
      return token[0].split('=')[1];
    }
    return null;
  }

  async validate({ email }: { email: string }) {
    const user = await this.authService.findUserByEmail(email);

    if (!user) return;

    return user;
  }
}
