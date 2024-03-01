import { BadRequestException } from '@nestjs/common';
import { BaseEntity } from 'src/common/database/entity';
import { Tag } from './tags';
import { forEach } from 'lodash';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { Stage } from './stage';
import { ValueObject } from 'src/common/database/ValueObject';

interface teamMember {
  userID: string;
  isOwner: boolean;
}

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  createdAt?: Date;
  tags: Tag[];
  team: teamMember[];
  creatorId: string;
  stages: Stage[];
}

export class ProjectEntity extends BaseEntity {
  private static readonly maxTags = 5;
  private readonly maxTeamMember = 5;
  private static readonly maxNumStages = 4;
  private newTags: Tag[];
  private newTeamMember: teamMember;

  private constructor(
    protected readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private tags: Tag[],
    private readonly createdAt: Date,
    private readonly creatorId: string,
    private team: teamMember[],
    private stage: Stage[],
  ) {
    super(id);
  }

  getTitleName() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getTags() {
    return this.tags;
  }

  getNewTags() {
    return this.newTags;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getCreatorId() {
    return this.creatorId;
  }

  getProjectTeam() {
    return this.team;
  }

  getNewTeamMember() {
    return this.newTeamMember;
  }

  getStages() {
    return this.stage;
  }

  static create({
    id,
    tags,
    title,
    createdAt,
    description,
    creatorId,
    team,
    stages,
  }: ProjectProps) {
    if (description.length < 1)
      throw new BadRequestException('Description is required');

    if (title.length < 1) throw new BadRequestException('Title is required');

    ProjectEntity.verifyStages(stages);

    ProjectEntity.verifyTags(tags);

    return new ProjectEntity(
      id,
      title,
      description,
      tags,
      createdAt ? createdAt : new Date(),
      creatorId,
      team,
      stages,
    );
  }

  private static verifyStages(stages: Stage[]) {
    if (stages.length >= ProjectEntity.maxNumStages)
      throw new BadRequestException(
        `Max number '${ProjectEntity.maxNumStages}' of stages exceeded`,
      );
    ProjectEntity.verifyDuplicates(stages, 'Stage');
  }

  private static verifyTags(tags: Tag[]) {
    if (tags.length > ProjectEntity.maxTags)
      throw new BadRequestException('Maximum tags exceeded');
    ProjectEntity.verifyDuplicates(tags, 'Tag');
  }

  private static verifyDuplicates(tags: ValueObject[], message: string) {
    forEach(tags, (tag, i) => {
      forEach(tags.slice(i + 1), (_tag) => {
        if (tag.equals(_tag)) {
          throw new BadRequestException(`${message} already exists`);
        }
      });
    });
  }

  addTags(newTags: Tag[]): void {
    const tags = [...newTags, ...this.tags];

    ProjectEntity.verifyTags(tags);
    this.tags = tags;
    this.newTags = newTags;
  }

  addMemberToProject(user: AuthUserEntity) {
    if (this.team.length >= this.maxTeamMember) {
      throw new BadRequestException('Maximum team size reached');
    }

    const newMember = { userID: user.getId(), isOwner: false };

    const newTeam = [...this.team, newMember];

    //TODO: change team members to value object
    forEach(newTeam, (member, i) => {
      forEach(newTeam.slice(i + 1), (_member) => {
        if (member.userID == _member.userID) {
          throw new BadRequestException(`User already added to the team`);
        }
      });
    });
    this.newTeamMember = newMember;

    this.team.push(newMember);
  }
}
