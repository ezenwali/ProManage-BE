import { config } from 'dotenv';
config();

const nodeEnv = <'development' | 'production'>process.env.NODE_ENV;

const port = +process.env.PORT || 8000;
const isProduction = () => process.env.NODE_ENV === 'production';

const backendUrl = isProduction()
  ? 'https://promanage-server.com'
  : `http://localhost:${port}`;

const frontEndUrl = isProduction()
  ? 'https://promanage.com'
  : 'http://localhost:3000';

export const environmentVariables = {
  nodeEnv,
  port: port,
  isProduction: isProduction(),
  origins: [frontEndUrl],
  PGdbUrl: process.env.PGDATABASE_URL,
  RedisUrl: process.env.REDIS_STORE_URL,
  frontEndUrl,
  jwt_token: {
    secret: process.env.SECRET_KEY,
    expires_in: `${Number(process.env.SESSION_MAXAGE) / (60 * 60 * 1000)}d`,
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
  },

  email: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORDS,
    host: process.env.EMAIL_HOST,
  },

  google_auth: {
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientID: process.env.GOOGLE_CLIENT_ID,
    callbackURL: `${backendUrl}/auth/google/redirect`,
  },

  session: {
    sessionSecret: process.env.SESSION_SECRET,
    sessionaaxAge: process.env.SESSION_MAXAGE,
  },
};

if (!isProduction()) {
  environmentVariables.origins.push(undefined);
}
