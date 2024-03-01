import { ApiProperty } from '@nestjs/swagger';
import { userType } from 'src/common/interfaces/user.types';

export class UserResult {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  userType: keyof typeof userType;
}
