import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_PROJECT_SERVICE_NAME } from '@shared';
import { CreateProjectDto } from '../dto/create-project.dto';
import { DeleteProjectDto } from '../dto/delete-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { FindOneProjectDto } from '../dto/find-one-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectServiceService } from '../services/project-service.service';

@Controller()
export class ProjectServiceController {
  constructor(private readonly projectService: ProjectServiceService) {}

  @GrpcMethod(String(GRPC_PROJECT_SERVICE_NAME), 'CreateProject')
  createProject(payload: CreateProjectDto) {
    return this.projectService.createProject(payload);
  }

  @GrpcMethod(String(GRPC_PROJECT_SERVICE_NAME), 'FindAllProjects')
  findAllProjects(payload: FindAllProjectsDto) {
    return this.projectService.findAllProjects(payload);
  }

  @GrpcMethod(String(GRPC_PROJECT_SERVICE_NAME), 'FindOneProject')
  findOneProject(payload: FindOneProjectDto) {
    return this.projectService.findOneProject(payload);
  }

  @GrpcMethod(String(GRPC_PROJECT_SERVICE_NAME), 'UpdateProject')
  updateProject(payload: UpdateProjectDto) {
    return this.projectService.updateProject(payload);
  }

  @GrpcMethod(String(GRPC_PROJECT_SERVICE_NAME), 'DeleteProject')
  deleteProject(payload: DeleteProjectDto) {
    return this.projectService.deleteProject(payload);
  }
}
