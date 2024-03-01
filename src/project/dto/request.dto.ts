import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  @ApiProperty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  @ArrayMinSize(1)
  tags: string[];
}

export class AddTagDto {
  @IsNotEmpty()
  @ApiProperty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  @ArrayMinSize(1)
  tags: string[];
}

export class AddTeamMemberDto {
  @IsNotEmpty()
  @ApiProperty()
  projectId: string;

  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
