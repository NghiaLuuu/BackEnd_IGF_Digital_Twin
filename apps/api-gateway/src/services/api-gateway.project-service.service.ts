import {
  GatewayTimeoutException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import type { Observable } from 'rxjs';
import { GRPC_PROJECT_SERVICE_NAME } from '../../../../libs/shared/src';
import type {
  CreateProjectRequest,
  CreateProjectResponse__Output,
  DeleteProjectRequest,
  DeleteProjectResponse__Output,
  FindAllProjectsRequest,
  FindAllProjectsResponse__Output,
  FindOneProjectRequest,
  FindOneProjectResponse__Output,
  UpdateProjectRequest,
  UpdateProjectResponse__Output,
} from '#grpc/project';

type ProjectGrpcService = {
  createProject(
    input: CreateProjectRequest,
  ): Observable<CreateProjectResponse__Output>;
  findAllProjects(
    input: FindAllProjectsRequest,
  ): Observable<FindAllProjectsResponse__Output>;
  findOneProject(
    input: FindOneProjectRequest,
  ): Observable<FindOneProjectResponse__Output>;
  updateProject(
    input: UpdateProjectRequest,
  ): Observable<UpdateProjectResponse__Output>;
  deleteProject(
    input: DeleteProjectRequest,
  ): Observable<DeleteProjectResponse__Output>;
};

@Injectable()
export class ApiGatewayProjectService implements OnModuleInit {
  private projectService!: ProjectGrpcService;

  constructor(
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.projectService = this.projectClient.getService<ProjectGrpcService>(
      String(GRPC_PROJECT_SERVICE_NAME),
    );
  }

  async createProject(
    input: CreateProjectRequest,
  ): Promise<CreateProjectResponse__Output> {
    try {
      return await firstValueFrom(
        this.projectService.createProject(input).pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleProjectError(error);
    }
  }

  async findAllProjects(
    input: FindAllProjectsRequest,
  ): Promise<FindAllProjectsResponse__Output> {
    try {
      return await firstValueFrom(
        this.projectService.findAllProjects(input).pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleProjectError(error);
    }
  }

  async findOneProject(
    input: FindOneProjectRequest,
  ): Promise<FindOneProjectResponse__Output> {
    try {
      return await firstValueFrom(
        this.projectService.findOneProject(input).pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleProjectError(error);
    }
  }

  async updateProject(
    input: UpdateProjectRequest,
  ): Promise<UpdateProjectResponse__Output> {
    try {
      return await firstValueFrom(
        this.projectService.updateProject(input).pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleProjectError(error);
    }
  }

  async deleteProject(
    input: DeleteProjectRequest,
  ): Promise<DeleteProjectResponse__Output> {
    try {
      return await firstValueFrom(
        this.projectService.deleteProject(input).pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleProjectError(error);
    }
  }

  private handleProjectError(error: unknown): never {
    if (this.isTimeoutError(error)) {
      throw new GatewayTimeoutException(
        'project-service did not respond within 3 seconds',
      );
    }

    throw new InternalServerErrorException('Failed to call project-service');
  }

  private isTimeoutError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (error as { name?: string }).name === 'TimeoutError';
  }
}
