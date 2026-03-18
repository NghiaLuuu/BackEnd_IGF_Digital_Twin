import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ELEMENT_REPOSITORY } from '../contracts/element-repository.interface';
import { ListProjectElementsDto } from '../dto/list-project-elements.dto';
import { SaveProjectElementsDto } from '../dto/save-project-elements.dto';
import type { ElementHealthModel } from '../models/element-health.model';
import type { ElementModel } from '../models/element.model';

type ElementRepositoryContract = {
  getHealth(): Promise<ElementHealthModel>;
  saveProjectElements(input: {
    projectId: string;
    requesterUserId: string;
    elements: Array<{
      type: string;
      x: number;
      y: number;
      z: number;
      width: number;
      height: number;
      depth: number;
      color: string;
    }>;
  }): Promise<ElementModel[]>;
  listProjectElements(projectId: string): Promise<ElementModel[]>;
};

type SaveProjectElementsResponse = {
  projectId: string;
  elements: ElementModel[];
  savedCount: number;
};

type ListProjectElementsResponse = {
  projectId: string;
  elements: ElementModel[];
};

@Injectable()
export class ElementServiceService {
  constructor(
    @Inject(ELEMENT_REPOSITORY)
    private readonly elementRepository: ElementRepositoryContract,
  ) {}

  getHealth() {
    return this.elementRepository.getHealth();
  }

  async saveProjectElements(
    payload: SaveProjectElementsDto,
  ): Promise<SaveProjectElementsResponse> {
    this.ensureAdmin(payload.requesterRoles);

    const elements = payload.elements.map((element) => ({
      type: element.type,
      x: element.x,
      y: element.y,
      z: element.z,
      width: element.width,
      height: element.height,
      depth: element.depth,
      color: element.color,
    }));

    const savedElements = await this.elementRepository.saveProjectElements({
      projectId: payload.projectId,
      requesterUserId: payload.requesterUserId,
      elements,
    });

    return {
      projectId: payload.projectId,
      elements: savedElements,
      savedCount: savedElements.length,
    };
  }

  async listProjectElements(
    payload: ListProjectElementsDto,
  ): Promise<ListProjectElementsResponse> {
    this.ensureAdmin(payload.requesterRoles);

    const elements = await this.elementRepository.listProjectElements(
      payload.projectId,
    );

    return {
      projectId: payload.projectId,
      elements,
    };
  }

  private ensureAdmin(requesterRoles: string[]): void {
    if (!requesterRoles.includes('admin')) {
      throw new ForbiddenException(
        'You are not allowed to access element data',
      );
    }
  }
}
