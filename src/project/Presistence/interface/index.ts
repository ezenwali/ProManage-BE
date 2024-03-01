import { ProjectEntity } from 'src/project/Base/projectEntity';
import { Tag } from 'src/project/Base/tags';

export abstract class IProjectRepository {
  abstract createProject(project: ProjectEntity): Promise<void>;
  abstract getProjectDetailsById(projectId: string): Promise<ProjectEntity>;
  abstract getProjectsByUserId(userId: string): Promise<ProjectEntity[]>;
  abstract getProjectId(
    userId: string,
    projectId: string,
  ): Promise<ProjectEntity>;
  abstract addMembertoProject(userId: ProjectEntity): Promise<void>;
}

export abstract class ITagRepository {
  abstract getTagsByProjectId(projectId: string): Promise<Tag[]>;
  abstract addTags(tags: ProjectEntity): Promise<void>;
}
