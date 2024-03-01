import { Injectable } from '@nestjs/common';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { AuthUserSchema } from './Schemas';
import { EntitySchemaFactory } from 'src/common/database/entity';

@Injectable()
export class AuthUserSchemaFactory
  implements EntitySchemaFactory<AuthUserSchema, AuthUserEntity>
{
  async create(user: AuthUserEntity): Promise<AuthUserSchema> {
    return {
      id: user.getId(),
      email: user.getEmail(),
      password: await user.getHasedPassword(),
      createdAt: user.getCreatedAt(),
      userType: user.getUserType(),
    };
  }

  createFromSchema(AuthUserSchema: AuthUserSchema): AuthUserEntity {
    const { id, email, password, createdAt, userType } = AuthUserSchema;
    return AuthUserEntity.create({ id, email, password, createdAt, userType });
  }
}
