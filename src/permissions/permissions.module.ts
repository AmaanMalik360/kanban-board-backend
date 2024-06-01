import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permission.entity';
import { CheckPermissionService } from 'src/guards/permissions/check-permission';
import { UserPermissions } from 'src/userpermissions/entities/userpermission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions, UserPermissions])],
  controllers: [PermissionsController],
  providers: [PermissionsService, CheckPermissionService],

})
export class PermissionsModule {}
