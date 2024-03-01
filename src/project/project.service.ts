import { Injectable } from '@nestjs/common';
import { ProjectEntity } from './Base/projectEntity';
import { IProjectRepository, ITagRepository } from './Presistence/interface';
import { AddTagDto, AddTeamMemberDto, CreateProjectDto } from './dto';
import * as shortid from 'shortid';
import { Tag } from './Base/tags';
import { IAuthRepository } from 'src/auth/Presistence/interfaces';
import { getDefaultStages } from './common';

type baseTypeWithUserID<T> = T & {
  creatorId: string;
};

@Injectable({})
export class ProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly tagRepository: ITagRepository,
    private readonly authRepository: IAuthRepository,
  ) {}

  async createProject(projectDetails: baseTypeWithUserID<CreateProjectDto>) {
    const id = shortid.generate();
    const { creatorId, tags: _tags, title, description } = projectDetails;

    const tags = Tag.createTags(_tags);

    const project = ProjectEntity.create({
      id,
      tags,
      title,
      description,
      creatorId,
      team: [{ userID: creatorId, isOwner: true }],
      stages: getDefaultStages(),
    });

    try {
      await this.projectRepository.createProject(project);
    } catch (error) {
      throw error;
    }
  }

  async addTagsToProject(tagDetails: AddTagDto) {
    try {
      const { projectId, tags } = tagDetails;

      //TODO: Verify that the project belong to the requested user
      const project =
        await this.projectRepository.getProjectDetailsById(projectId);
      const newTags = Tag.createTags(tags);
      project.addTags(newTags);

      await this.tagRepository.addTags(project);
    } catch (error) {
      throw error;
    }
  }

  async getProjects(userId: string): Promise<ProjectEntity[]> {
    try {
      const projects = await this.projectRepository.getProjectsByUserId(userId);

      return projects;
    } catch (error) {
      throw error;
    }
  }

  async getProjectById(
    userId: string,
    projectId: string,
  ): Promise<ProjectEntity> {
    try {
      const project = await this.projectRepository.getProjectId(
        userId,
        projectId,
      );

      return project;
    } catch (error) {
      throw error;
    }
  }

  async addTeamMemberToProject(details: AddTeamMemberDto): Promise<void> {
    try {
      const { projectId, userId } = details;

      const user = await this.authRepository.findUserById(userId);
      const project =
        await this.projectRepository.getProjectDetailsById(projectId);

      project.addMemberToProject(user);

      this.projectRepository.addMembertoProject(project);
    } catch (error) {
      throw error;
    }
  }
}
