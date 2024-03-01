import { Module } from '@nestjs/common';
import * as Redis from 'redis';

export const REDIS = Symbol('AUTH:REDIS');
import { environmentVariables } from 'src/config/env.variables';

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: Redis.createClient({ url: environmentVariables.RedisUrl }),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
