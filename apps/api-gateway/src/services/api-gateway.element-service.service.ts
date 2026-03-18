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
import { GRPC_ELEMENT_SERVICE_NAME } from '#shared';
import type {
  ElementInput,
  ListProjectElementsRequest,
  ListProjectElementsResponse,
  SaveProjectElementsRequest,
  SaveProjectElementsResponse,
} from '#grpc/element';

type ElementGrpcService = {
  saveProjectElements(
    input: SaveProjectElementsRequest,
  ): Observable<SaveProjectElementsResponse>;
  listProjectElements(
    input: ListProjectElementsRequest,
  ): Observable<ListProjectElementsResponse>;
};

@Injectable()
export class ApiGatewayElementService implements OnModuleInit {
  private elementService!: ElementGrpcService;

  constructor(
    @Inject('ELEMENT_SERVICE') private readonly elementClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.elementService = this.elementClient.getService<ElementGrpcService>(
      String(GRPC_ELEMENT_SERVICE_NAME),
    );
  }

  async saveProjectElements(input: {
    projectId: string;
    requesterUserId: string;
    requesterRoles: string[];
    elements: ElementInput[];
  }): Promise<SaveProjectElementsResponse> {
    try {
      return await firstValueFrom(
        this.elementService
          .saveProjectElements({
            projectId: input.projectId,
            requesterUserId: input.requesterUserId,
            requesterRoles: input.requesterRoles,
            elements: input.elements,
          })
          .pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleElementError(error);
    }
  }

  async listProjectElements(input: {
    projectId: string;
    requesterUserId: string;
    requesterRoles: string[];
  }): Promise<ListProjectElementsResponse> {
    try {
      return await firstValueFrom(
        this.elementService
          .listProjectElements({
            projectId: input.projectId,
            requesterUserId: input.requesterUserId,
            requesterRoles: input.requesterRoles,
          })
          .pipe(timeout(3000)),
      );
    } catch (error: unknown) {
      this.handleElementError(error);
    }
  }

  private handleElementError(error: unknown): never {
    if (this.isTimeoutError(error)) {
      throw new GatewayTimeoutException(
        'element-service did not respond within 3 seconds',
      );
    }

    throw new InternalServerErrorException('Failed to call element-service');
  }

  private isTimeoutError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (error as { name?: string }).name === 'TimeoutError';
  }
}
