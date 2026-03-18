import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROJECT_REPOSITORY } from '../contracts/project-repository.interface';
import type { IProjectRepository } from '../contracts/project-repository.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { DeleteProjectDto } from '../dto/delete-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { FindOneProjectDto } from '../dto/find-one-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import type { ProjectItemModel, ProjectModel } from '../models/project.model';

type CreateProjectResponse = {
  item: ProjectItemModel;
};

type FindAllProjectsResponse = {
  items: ProjectItemModel[];
  page: number;
  limit: number;
  total: number;
};

type FindOneProjectResponse = {
  item: ProjectItemModel;
};

type UpdateProjectResponse = {
  item: ProjectItemModel;
};

type DeleteProjectResponse = {
  success: boolean;
  projectId: string;
  message: string;
};

type PrismaNotFoundError = {
  code?: string;
};

@Injectable()
export class ProjectServiceService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async createProject(
    payload: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    this.ensureAdmin(payload.requesterRoles);

    const item = await this.projectRepository.createProject({
      name: payload.name,
      description: payload.description,
      requesterUserId: payload.requesterUserId,
    });

    return { item: this.toProjectItem(item) };
  }

  async findAllProjects(
    payload: FindAllProjectsDto,
  ): Promise<FindAllProjectsResponse> {
    this.ensureAdmin(payload.requesterRoles);

    const page = payload.page > 0 ? payload.page : 1;
    const limit = payload.limit > 0 ? Math.min(payload.limit, 100) : 10;

    const { items, total } = await this.projectRepository.findAllProjects({
      page,
      limit,
      search: payload.search,
    });

    return {
      items: items.map((item) => this.toProjectItem(item)),
      page,
      limit,
      total,
    };
  }

  async findOneProject(
    payload: FindOneProjectDto,
  ): Promise<FindOneProjectResponse> {
    this.ensureAdmin(payload.requesterRoles);

    const item = await this.projectRepository.findProjectById(
      payload.projectId,
    );

    if (!item) {
      throw new NotFoundException(`Project ${payload.projectId} not found`);
    }

    return { item: this.toProjectItem(item) };
  }

  async updateProject(
    payload: UpdateProjectDto,
  ): Promise<UpdateProjectResponse> {
    this.ensureAdmin(payload.requesterRoles);

    try {
      const item = await this.projectRepository.updateProject({
        projectId: payload.projectId,
        name: payload.name,
        description: payload.description,
        requesterUserId: payload.requesterUserId,
      });

      return { item: this.toProjectItem(item) };
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Project ${payload.projectId} not found`);
      }
      throw error;
    }
  }

  async deleteProject(
    payload: DeleteProjectDto,
  ): Promise<DeleteProjectResponse> {
    this.ensureAdmin(payload.requesterRoles);

    try {
      await this.projectRepository.deleteProject(payload.projectId);
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Project ${payload.projectId} not found`);
      }
      throw error;
    }

    return {
      success: true,
      projectId: payload.projectId,
      message: 'Project deleted successfully',
    };
  }

  private ensureAdmin(requesterRoles: string[]): void {
    if (!requesterRoles.includes('admin')) {
      throw new ForbiddenException(
        'You are not allowed to access project data',
      );
    }
  }

  private isPrismaNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (error as PrismaNotFoundError).code === 'P2025';
  }

  private toProjectItem(item: ProjectModel): ProjectItemModel {
    return {
      projectId: item.projectId,
      name: item.name,
      description: item.description ?? '',
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
    };
  }
}
