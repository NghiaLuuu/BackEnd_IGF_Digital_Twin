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
import { GRPC_PROJECT_SERVICE_NAME } from '@shared';
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectRequest,
  DeleteProjectResponse,
  FindAllProjectsRequest,
  FindAllProjectsResponse,
  FindOneProjectRequest,
  FindOneProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
} from '@grpc/project';

type ProjectGrpcService = {
  createProject(input: CreateProjectRequest): Observable<CreateProjectResponse>;
  findAllProjects(
    input: FindAllProjectsRequest,
  ): Observable<FindAllProjectsResponse>;
  findOneProject(
    input: FindOneProjectRequest,
  ): Observable<FindOneProjectResponse>;
  updateProject(input: UpdateProjectRequest): Observable<UpdateProjectResponse>;
  deleteProject(input: DeleteProjectRequest): Observable<DeleteProjectResponse>;
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
  ): Promise<CreateProjectResponse> {
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
  ): Promise<FindAllProjectsResponse> {
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
  ): Promise<FindOneProjectResponse> {
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
  ): Promise<UpdateProjectResponse> {
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
  ): Promise<DeleteProjectResponse> {
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
