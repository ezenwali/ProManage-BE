import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITagRepository } from '../interface';
import { Tag } from 'src/project/Base/tags';
import { ProjectEntity } from 'src/project/Base/projectEntity';

@Injectable({})
export class TagRepository implements ITagRepository {
  constructor(private readonly db: PrismaService) {}

  // TODO: Make this function take Product Entitty
  // async addTags(tags: Tag[]): Promise<void> {
  //   try {
  //     await this.db.tag.createMany({
  //       data: tags.map((tag) => ({
  //         tagName: tag.getTagName(),
  //         projectID: tag.getProjectId(),
  //       })),
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async addTags(project: ProjectEntity): Promise<void> {
    console.log(project.getCreatorId());

    try {
      await this.db.tag.createMany({
        data: project.getNewTags().map((tag) => ({
          tagName: tag.getTagName(),
          projectID: project.getId(),
        })),
      });
    } catch (error) {
      throw error;
    }
  }

  async getTagsByProjectId(projectId: string): Promise<Tag[]> {
    try {
      const tags = await this.db.tag.findMany({
        where: {
          projectID: {
            equals: projectId,
          },
        },
      });

      if (tags.length === 0) {
        throw new NotFoundException('Project does not exist');
      }

      const tagName = tags.map((tag) => tag.tagName);

      return Tag.createTags(tagName);
    } catch (error) {
      throw error;
    }
  }
}
