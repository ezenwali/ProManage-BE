import { IdentifiableEntitySchema } from 'src/common/database/entity';
import { userType } from 'src/common/interfaces/user.types';

export class AuthUserSchema implements IdentifiableEntitySchema {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  userType: keyof typeof userType;
}

export class VerificationCodeSchema implements IdentifiableEntitySchema {
  id: string;
  email: string;
  createdAt: Date;
  code: number;
}
