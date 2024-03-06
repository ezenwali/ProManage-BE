import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class IServiceResponse<T> {
  data?: T;

  @ApiProperty({
    example: 200,
  })
  status: number;

  @ApiProperty({
    example: 'success',
  })
  message: string;
}

export const ApiCustomResponse = <DataDto extends Type<unknown>>(
  status: HttpStatus,
  dataDto?: DataDto,
  type?: 'array',
) => {
  if (!dataDto) {
    return applyDecorators(
      ApiExtraModels(IServiceResponse),
      status === HttpStatus.CREATED
        ? ApiCreatedResponse({
            type: IServiceResponse,
          })
        : ApiOkResponse({
            type: IServiceResponse,
          }),
    );
  }

  const data = type
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(dataDto) },
      }
    : { $ref: getSchemaPath(dataDto) };

  return applyDecorators(
    ApiExtraModels(IServiceResponse, dataDto),
    status === HttpStatus.CREATED
      ? ApiCreatedResponse({
          schema: {
            allOf: [
              { $ref: getSchemaPath(IServiceResponse) },
              {
                properties: {
                  data,
                },
              },
            ],
          },
        })
      : ApiOkResponse({
          schema: {
            allOf: [
              { $ref: getSchemaPath(IServiceResponse) },
              {
                properties: {
                  data,
                },
              },
            ],
          },
        }),
  );
};
