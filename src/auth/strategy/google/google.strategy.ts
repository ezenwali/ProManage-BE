import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { environmentVariables } from 'src/config/env.variables';
import { AuthService } from '../../auth.service';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: environmentVariables.google_auth.clientID,
      clientSecret: environmentVariables.google_auth.clientSecret,
      callbackURL: environmentVariables.google_auth.callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails[0].value;
    let user: AuthUserEntity;
    user = await this.authService.findUserByEmail(email);

    if (!user) {
      user = await this.authService.registerUser(email, 'Google');
    }

    // take user google profile and update user profile in db
    return user;
  }
}
