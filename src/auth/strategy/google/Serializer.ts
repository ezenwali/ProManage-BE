import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Done } from 'src/auth/interfaces';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user, done: Done) {
    done(null, user);
  }

  async deserializeUser(payload, done: Done) {
    const user = await this.authService.findUserByEmail(payload?.email);

    return !user ? done(null, null) : done(null, user);
  }
}
