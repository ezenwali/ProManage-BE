import { ProjectEntity } from '../Base/projectEntity';
import { getDefaultStages } from '../common';
import { Tag } from '../Base/tags';
import { BadRequestException } from '@nestjs/common';
import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';

describe('Project Entity', () => {
  let project: ProjectEntity;

  const tags = Tag.createTags(['Fee', 'Bees']);

  const owner = { userID: '1', isOwner: true };
  const creatorId = '1';

  const mockProjectProps = {
    id: 'project_id',
    title: 'Project Title',
    description: 'Project Description',
    createdAt: new Date(),
    creatorId,
    tags,
    team: [owner],
    stages: getDefaultStages(),
  };

  beforeEach(() => {
    project = ProjectEntity.create(mockProjectProps);
  });

  describe('Project creation', () => {
    it('should create a project instance', () => {
      expect(project).toBeInstanceOf(ProjectEntity);
    });

    it('should throw BadRequestException if title is empty', () => {
      try {
        ProjectEntity.create({ ...mockProjectProps, title: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBe('Title is required');
      }
    });

    it('should throw BadRequestException if description is empty', () => {
      try {
        ProjectEntity.create({ ...mockProjectProps, description: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBe('Description is required');
      }
    });
  });

  describe('Tags functionality', () => {
    it('should add tags to the project', () => {
      const newTags = Tag.createTags(['Tag 1', 'Tag 2']);
      project.addTags(newTags);

      expect(project.getTags().length).toEqual(4);
    });

    it('should throw BadRequestException if maximum tags exceeded', () => {
      const newTags = Tag.createTags(['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4']);

      try {
        project.addTags(newTags);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBe('Maximum tags exceeded');
      }
    });
  });

  describe('Team functionality', () => {
    const newMember = AuthUserEntity.create({
      email: 'shed@gmail.com',
      id: '2',
      password: 'password',
      createdAt: new Date(),
      userType: 'Email_Password',
    });

    it('should add a member to the project team', () => {
      project.addMemberToProject(newMember);

      expect(project.getProjectTeam().length).toBe(2);
    });

    it('should throw error for addding same user', () => {
      try {
        project.addMemberToProject(newMember);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBe('User already added to the team');
      }
    });
  });
});
