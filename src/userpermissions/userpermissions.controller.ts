import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Request, UseGuards } from '@nestjs/common';
import { UserPermissionsService } from './userpermissions.service';
import { UserPermissionDto } from './dto/user-permission.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('')
@UseGuards(AuthGuard)
export class UserPermissionsController {

  constructor(private readonly userpermissionsService: UserPermissionsService) {}

  @Get('admin/user-permissions')
  findAllUserPermissions() {
    return this.userpermissionsService.findAllUserPermissions();
  }

  @Patch('admin/change-permission/:id')
  changePermission(
    @Param('id', ParseIntPipe) id: number, 
    @Body() userPermissionDto: UserPermissionDto,
    @Request() req
  ){
    // Check if the user who is sending the request is loggedIn
    // console.log("id: ", id)
    // console.log("req.user.id: ", req.user.id)
      if (id !== req.user.id) {
        throw new HttpException("Unauthorized. Can't Access", HttpStatus.UNAUTHORIZED);
      }
    return this.userpermissionsService.changePermission(id, userPermissionDto.userId, userPermissionDto.permissionId);
  }
}
