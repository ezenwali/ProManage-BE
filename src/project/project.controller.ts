import {
  Body,
  HttpCode,
  Controller,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/config/guards/auth.guard';
import { AddTagDto, AddTeamMemberDto, CreateProjectDto } from './dto';
import { ProjectService } from './project.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/getUser';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { ProjectsResultDto } from './dto/response.dto';

@Injectable()
@UseGuards(AuthGuard)
@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @Post()
  async createProject(
    @GetUser() user: AuthUserEntity,
    @Body() dto: CreateProjectDto,
  ): Promise<{ message: string }> {
    await this.projectService.createProject({
      ...dto,
      creatorId: user.getId(),
    });

    return { message: 'Project created successfully' };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @Post('tags/add')
  async addTagsToProject(@Body() dto: AddTagDto): Promise<void> {
    await this.projectService.addTagsToProject(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProjectsResultDto, isArray: true })
  @Get()
  async getProjects(
    @GetUser() user: AuthUserEntity,
  ): Promise<ProjectsResultDto[]> {
    const _projects = await this.projectService.getProjects(user.getId());

    const projects = _projects.map((project) => ({
      id: project.getId(),
      title: project.getTitleName(),
      description: project.getDescription(),
      creatorId: project.getCreatorId(),
      createdAt: project.getCreatedAt(),
      team: project.getProjectTeam().length,
      tags: project.getTags().length,
    }));

    return projects;
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ProjectsResultDto, isArray: true })
  @Post('addteammember')
  async addUserToProject(@Body() dto: AddTeamMemberDto): Promise<void> {
    return await this.projectService.addTeamMemberToProject(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get(':projectId')
  async getProjectById(
    @GetUser() user: AuthUserEntity,
    @Param('projectId') projectId: string,
  ): Promise<any> {
    const _project = await this.projectService.getProjectById(
      user.getId(),
      projectId,
    );

    return _project;
  }
}
