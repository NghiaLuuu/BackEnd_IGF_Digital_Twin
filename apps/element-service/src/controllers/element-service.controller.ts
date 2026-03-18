import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_ELEMENT_SERVICE_NAME } from '#shared';
import { ListProjectElementsDto } from '../dto/list-project-elements.dto';
import { SaveProjectElementsDto } from '../dto/save-project-elements.dto';
import { ElementServiceService } from '../services/element-service.service';

@Controller()
export class ElementServiceController {
  constructor(private readonly elementService: ElementServiceService) {}

  @GrpcMethod(String(GRPC_ELEMENT_SERVICE_NAME), 'GetHealth')
  health() {
    return this.elementService.getHealth();
  }

  @GrpcMethod(String(GRPC_ELEMENT_SERVICE_NAME), 'SaveProjectElements')
  saveProjectElements(payload: SaveProjectElementsDto) {
    return this.elementService.saveProjectElements(payload);
  }

  @GrpcMethod(String(GRPC_ELEMENT_SERVICE_NAME), 'ListProjectElements')
  listProjectElements(payload: ListProjectElementsDto) {
    return this.elementService.listProjectElements(payload);
  }
}
