import type { ElementHealthModel } from '../models/element-health.model';
import type { ElementInputModel, ElementModel } from '../models/element.model';

export const ELEMENT_REPOSITORY = Symbol('ELEMENT_REPOSITORY');

export interface IElementRepository {
  getHealth(): Promise<ElementHealthModel>;

  saveProjectElements(input: {
    projectId: string;
    requesterUserId: string;
    elements: ElementInputModel[];
  }): Promise<ElementModel[]>;

  listProjectElements(projectId: string): Promise<ElementModel[]>;
}
