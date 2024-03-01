import * as session from 'express-session';
import { environmentVariables } from 'src/config/env.variables';

/**
 * TODO: remove httpOnly: false, and implement log out handler to clear cookies in FE
 */
export const _session = session({
  name: 'user_token',
  secret: environmentVariables.session.sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: Number(environmentVariables.session.sessionaaxAge),
    httpOnly: false,
  },
});
