import type { ProjectModel } from '../models/project.model';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface IProjectRepository {
  createProject(input: {
    name: string;
    description: string;
    requesterUserId: string;
  }): Promise<ProjectModel>;

  findAllProjects(input: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{ items: ProjectModel[]; total: number }>;

  findProjectById(projectId: string): Promise<ProjectModel | null>;

  updateProject(input: {
    projectId: string;
    name: string;
    description: string;
    requesterUserId: string;
  }): Promise<ProjectModel>;

  deleteProject(projectId: string): Promise<void>;
}
