import { Injectable } from '@nestjs/common';
import { PrismaService } from '#database';
import { PrismaClient as ElementPrismaClient } from '#gen-element/client';
import type { IElementRepository } from '../contracts/element-repository.interface';
import type { ElementHealthModel } from '../models/element-health.model';
import type { ElementInputModel, ElementModel } from '../models/element.model';

@Injectable()
export class ElementRepository implements IElementRepository {
  constructor(private readonly db: PrismaService<ElementPrismaClient>) {}

  async getHealth(): Promise<ElementHealthModel> {
    return {
      service: 'element-service',
      status: 'ok',
    };
  }

  async saveProjectElements(input: {
    projectId: string;
    requesterUserId: string;
    elements: ElementInputModel[];
  }): Promise<ElementModel[]> {
    await this.db.client.$transaction(async (tx) => {
      await tx.element.deleteMany({ where: { projectId: input.projectId } });

      if (input.elements.length > 0) {
        await tx.element.createMany({
          data: input.elements.map((element) => ({
            projectId: input.projectId,
            type: element.type,
            x: element.x,
            y: element.y,
            z: element.z,
            width: element.width,
            height: element.height,
            depth: element.depth,
            color: element.color,
          })),
        });
      }
    });

    return this.listProjectElements(input.projectId);
  }

  async listProjectElements(projectId: string): Promise<ElementModel[]> {
    return this.db.client.element.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      select: {
        elementId: true,
        projectId: true,
        type: true,
        x: true,
        y: true,
        z: true,
        width: true,
        height: true,
        depth: true,
        color: true,
      },
    });
  }
}
