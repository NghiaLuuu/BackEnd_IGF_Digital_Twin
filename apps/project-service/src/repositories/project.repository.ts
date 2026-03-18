import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { IProjectRepository } from '../contracts/project-repository.interface';
import type { ProjectModel } from '../models/project.model';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly db: PrismaService) {}

  async createProject(input: {
    name: string;
    description: string;
    requesterUserId: string;
  }): Promise<ProjectModel> {
    return this.db.project.create({
      data: {
        name: input.name,
        description: input.description || null,
        createdBy: input.requesterUserId,
        updatedBy: input.requesterUserId,
      },
      select: {
        projectId: true,
        name: true,
        description: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async findAllProjects(input: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{ items: ProjectModel[]; total: number }> {
    const skip = (input.page - 1) * input.limit;
    const where = input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            {
              description: {
                contains: input.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [items, total] = await this.db.$transaction([
      this.db.project.findMany({
        where,
        skip,
        take: input.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          projectId: true,
          name: true,
          description: true,
          createdBy: true,
          updatedBy: true,
        },
      }),
      this.db.project.count({ where }),
    ]);

    return { items, total };
  }

  async findProjectById(projectId: string): Promise<ProjectModel | null> {
    return this.db.project.findUnique({
      where: { projectId },
      select: {
        projectId: true,
        name: true,
        description: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async updateProject(input: {
    projectId: string;
    name: string;
    description: string;
    requesterUserId: string;
  }): Promise<ProjectModel> {
    return this.db.project.update({
      where: { projectId: input.projectId },
      data: {
        name: input.name || undefined,
        description: input.description || undefined,
        updatedBy: input.requesterUserId,
      },
      select: {
        projectId: true,
        name: true,
        description: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.db.project.delete({ where: { projectId } });
  }
}
