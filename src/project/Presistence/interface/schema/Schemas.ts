import { IdentifiableEntitySchema } from 'src/common/database/entity';

export class ProjectSchema implements IdentifiableEntitySchema {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  createdAt: Date;
  Tag: { tagName: string; projectID: string }[];
  ProjectTeam: { projectID: string; userID: string; isOwner: boolean }[];
  Stage: { projectID: string; name: string; type: 'default' | 'created' }[];
}
