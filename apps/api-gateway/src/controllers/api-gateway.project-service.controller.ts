import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtUserPayload } from '../auth/types/jwt-user-payload.type';
import { CreateProjectDto } from '../dto/project/create-project.dto';
import { QueryProjectDto } from '../dto/project/query-project.dto';
import { UpdateProjectDto } from '../dto/project/update-project.dto';
import { ApiGatewayProjectService } from '../services/api-gateway.project-service.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ApiGatewayProjectServiceController {
  constructor(
    private readonly projectGatewayService: ApiGatewayProjectService,
  ) {}

  @Post()
  createProject(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectGatewayService.createProject({
      ...dto,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }

  @Get()
  getProjects(
    @Query() query: QueryProjectDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectGatewayService.findAllProjects({
      ...query,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }

  @Get(':id')
  getProjectById(
    @Param('id') projectId: string,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectGatewayService.findOneProject({
      projectId,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }

  @Patch(':id')
  updateProject(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectGatewayService.updateProject({
      projectId,
      ...dto,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }

  @Delete(':id')
  deleteProject(
    @Param('id') projectId: string,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectGatewayService.deleteProject({
      projectId,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }
}
