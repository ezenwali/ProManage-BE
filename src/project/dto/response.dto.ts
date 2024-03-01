import { ApiProperty } from '@nestjs/swagger';

export class ProjectsResultDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  team: number;
  @ApiProperty()
  tags: number;
  @ApiProperty()
  creatorId: string;
  @ApiProperty()
  createdAt: Date;
}
