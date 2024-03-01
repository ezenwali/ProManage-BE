import { ApiProperty } from '@nestjs/swagger';

export class VerificationCodeResult {
  @ApiProperty()
  isSent: boolean;
}
