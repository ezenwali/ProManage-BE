import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IProjectRepository, ITagRepository } from '../interface';
import { ProjectSchemaFactory } from '../interface/schema/schema-factory/project-schema.factory';
import { ProjectEntity } from 'src/project/Base/projectEntity';

@Injectable({})
export class ProjectRepository implements IProjectRepository {
  constructor(
    private readonly db: PrismaService,
    private readonly projectSchemaFactory: ProjectSchemaFactory,
    private readonly TagRepository: ITagRepository,
  ) {}

  async getProjectsByUserId(userId: string): Promise<ProjectEntity[]> {
    try {
      const _projects = await this.db.projectTeam.findMany({
        where: {
          userID: userId,
        },
        include: {
          project: true, // Include associated project data
        },
      });

      const projects = await Promise.all(
        _projects.map(async (project) => {
          const { id, createdAt, creatorId, title, description } =
            project.project;

          try {
            const ProjectTeam = await this.db.projectTeam.findMany({
              where: {
                projectID: id,
              },
            });

            const Stage = await this.db.stage.findMany({
              where: {
                projectID: id,
              },
            });

            const tag = await this.TagRepository.getTagsByProjectId(id);

            return {
              id,
              createdAt,
              creatorId,
              title,
              description,
              ProjectTeam,
              Tag: tag.map((tagItem) => ({
                tagName: tagItem.getTagName(),
                projectID: id,
              })),
              Stage,
            };
          } catch (error) {
            throw new Error(`Error fetching project details: ${error}`);
          }
        }),
      );

      const projectEn = projects.map((project) =>
        this.projectSchemaFactory.createFromSchema(project),
      );

      return projectEn;
    } catch (error) {
      throw new Error(`Error fetching projects: ${error}`);
    }
  }

  async getProjectDetailsById(projectId: string): Promise<ProjectEntity> {
    try {
      const projectsWithTags = await this.db.project.findFirst({
        where: {
          id: projectId,
        },
        include: {
          Tag: true,
          ProjectTeam: true,
          Stage: true,
        },
      });

      if (!projectsWithTags) {
        throw new NotFoundException('Project does not exist');
      }

      return this.projectSchemaFactory.createFromSchema(projectsWithTags);
    } catch (error) {
      throw error;
    }
  }

  async getProjectId(
    userId: string,
    projectId: string,
  ): Promise<ProjectEntity> {
    try {
      const project = await this.db.project.findFirst({
        where: {
          id: projectId,
          ProjectTeam: {
            some: {
              userID: userId,
            },
          },
        },

        include: {
          Tag: true,
          ProjectTeam: true,
          Stage: true,
        },
      });
      console.log(project);

      if (!project) {
        throw new NotFoundException('Project does not exist');
      }

      return this.projectSchemaFactory.createFromSchema(project);
    } catch (error) {
      throw error;
    }
  }

  async createProject(project: ProjectEntity): Promise<void> {
    const data = this.projectSchemaFactory.create(project);

    try {
      await this.db.project.create({
        data: {
          ...data,
          Tag: {
            create: data.Tag.map(({ tagName }) => ({ tagName })),
          },
          ProjectTeam: {
            create: data.ProjectTeam.map(({ userID, isOwner }) => ({
              userID,
              isOwner,
            })),
          },
          Stage: {
            create: data.Stage.map(({ name, type }) => ({
              name,
              type,
            })),
          },
        },
      });
    } catch (error) {
      throw new BadGatewayException('Could not create project');
    }
  }

  async addMembertoProject(project: ProjectEntity): Promise<void> {
    const { userID, isOwner } = project.getNewTeamMember();
    try {
      await this.db.projectTeam.create({
        data: {
          projectID: project.getId(),
          userID,
          isOwner,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
