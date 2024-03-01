import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { IProjectRepository, ITagRepository } from './Presistence/interface';
import { ProjectRepository } from './Presistence/Project/ProjectRepository';
import { ProjectSchemaFactory } from './Presistence/interface/schema/schema-factory/project-schema.factory';
import { PrismaConnectModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagRepository } from './Presistence/Project/TagRepository';
import { AuthRepository } from 'src/auth/Presistence/AuthRepository';
import { IAuthRepository } from 'src/auth/Presistence/interfaces';
import { AuthUserSchemaFactory } from 'src/auth/Presistence/interfaces/schema/authuser-schema.factory';
import { SaveVerificationCodeSchemaFactory } from 'src/auth/Presistence/interfaces/schema/verificationCode.schema.factory';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    { provide: IProjectRepository, useClass: ProjectRepository },
    { provide: ITagRepository, useClass: TagRepository },
    { provide: IAuthRepository, useClass: AuthRepository },
    ProjectSchemaFactory,
    PrismaConnectModule,
    PrismaService,
    AuthUserSchemaFactory,
    SaveVerificationCodeSchemaFactory,
  ],
})
export class ProjectModule {}
