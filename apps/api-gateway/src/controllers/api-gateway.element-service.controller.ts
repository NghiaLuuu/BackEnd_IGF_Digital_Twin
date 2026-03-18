import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtUserPayload } from '../auth/types/jwt-user-payload.type';
import { SaveProjectElementsDto } from '../dto/project/save-project-elements.dto';
import { ApiGatewayElementService } from '../services/api-gateway.element-service.service';

@Controller('elements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ApiGatewayElementServiceController {
  constructor(
    private readonly elementGatewayService: ApiGatewayElementService,
  ) {}

  @Post('project/:projectId')
  saveProjectElements(
    @Param('projectId') projectId: string,
    @Body() dto: SaveProjectElementsDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.elementGatewayService.saveProjectElements({
      projectId,
      elements: dto.elements,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }

  @Get('project/:projectId')
  getProjectElements(
    @Param('projectId') projectId: string,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.elementGatewayService.listProjectElements({
      projectId,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }
}
