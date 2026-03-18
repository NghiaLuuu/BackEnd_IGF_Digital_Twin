import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtUserPayload } from '../auth/types/jwt-user-payload.type';
import { LoginDto } from '../dto/auth/login.dto';
import { ApiGatewayAuthService } from '../services/api-gateway.auth-service.service';

@Controller('auth')
export class ApiGatewayAuthServiceController {
  constructor(private readonly authGatewayService: ApiGatewayAuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authGatewayService.login(dto);
  }

  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getProfile(
    @Param('userId') userId: string,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.authGatewayService.getProfile({
      targetUserId: userId,
      requesterUserId: user.sub,
      requesterRoles: user.roles,
    });
  }
}
