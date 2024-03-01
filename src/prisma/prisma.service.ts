import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { environmentVariables } from 'src/config/env.variables';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const config = {
      datasources: {
        db: { url: environmentVariables.PGdbUrl },
      },
    };
    super(config);
  }

  async cleanDatabase() {
    if (environmentVariables.isProduction) return;

    const models = Reflect.ownKeys(this)
      .filter((key) => typeof key === 'string')
      .filter((key) => key[0] !== '_' && key[0] !== '$') as string[];

    return this.$transaction(
      models.map((modelKey) => this[modelKey].deleteMany()),
    );
  }
}
