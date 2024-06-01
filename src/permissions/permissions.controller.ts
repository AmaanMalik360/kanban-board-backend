import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('admin/permissions')
  findAllPermissions() {
    return this.permissionsService.findAllPermissions();
  }

}
