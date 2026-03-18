import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../libs/database/src';
import { PrismaClient as ProjectPrismaClient } from '../generated/client';
import { PROJECT_REPOSITORY } from './contracts/project-repository.interface';
import { ProjectServiceController } from './controllers/project-service.controller';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectServiceService } from './services/project-service.service';

@Module({
  imports: [DatabaseModule.forRoot(ProjectPrismaClient)],
  controllers: [ProjectServiceController],
  providers: [
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    ProjectServiceService,
  ],
})
export class ProjectServiceModule {}
