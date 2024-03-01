import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from 'src/common/database/entity';
import { ProjectSchema } from '../Schemas';
import { ProjectEntity } from 'src/project/Base/projectEntity';
import { Tag as TagVobj } from 'src/project/Base/tags';
import { Stage as _Stage } from 'src/project/Base/stage';

@Injectable()
export class ProjectSchemaFactory
  implements EntitySchemaFactory<ProjectSchema, ProjectEntity>
{
  create(project: ProjectEntity): ProjectSchema {
    return {
      id: project.getId(),
      creatorId: project.getCreatorId(),
      title: project.getTitleName(),
      description: project.getDescription(),
      createdAt: project.getCreatedAt(),
      Tag: project.getTags().map((tag) => ({
        tagName: tag.getTagName(),
        projectID: project.getId(),
      })),
      ProjectTeam: project.getProjectTeam().map((projectTeam) => ({
        projectID: project.getId(),
        userID: projectTeam.userID,
        isOwner: projectTeam.isOwner,
      })),
      Stage: project.getStages().map((stage) => ({
        projectID: project.getId(),
        name: stage.getName(),
        type: stage.getType(),
      })),
    };
  }

  createFromSchema(ProjectSchema: ProjectSchema): ProjectEntity {
    const {
      id,
      creatorId,
      title,
      description,
      createdAt,
      Tag,
      ProjectTeam,
      Stage,
    } = ProjectSchema;

    const tags_name = Tag.map((tag) => tag.tagName);
    const team = ProjectTeam.map(({ userID, isOwner }) => ({
      userID,
      isOwner,
    }));

    const stages = Stage.map((stage) => _Stage.create(stage.name));

    return ProjectEntity.create({
      id,
      creatorId,
      title,
      description,
      createdAt,
      tags: TagVobj.createTags(tags_name),
      team,
      stages,
    });
  }
}
