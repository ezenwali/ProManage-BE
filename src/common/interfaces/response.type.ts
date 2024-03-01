import { ApiProperty } from "@nestjs/swagger";

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