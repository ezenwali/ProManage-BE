import { Injectable } from '@nestjs/common';
import { SaveVerificationCodeEntity } from '../../../Base/SaveVerificationCodeEntity';
import { VerificationCodeSchema } from './Schemas';
import { EntitySchemaFactory } from 'src/common/database/entity';

@Injectable()
export class SaveVerificationCodeSchemaFactory
  implements
    EntitySchemaFactory<VerificationCodeSchema, SaveVerificationCodeEntity>
{
  create(codeDetails: SaveVerificationCodeEntity): VerificationCodeSchema {
    return {
      id: codeDetails.getId(),
      email: codeDetails.getEmail(),
      code: codeDetails.getCode(),
      createdAt: codeDetails.getCreatedAt(),
    };
  }

  createFromSchema(
    codeDetails: VerificationCodeSchema,
  ): SaveVerificationCodeEntity {
    return SaveVerificationCodeEntity.create(codeDetails);
  }
}
