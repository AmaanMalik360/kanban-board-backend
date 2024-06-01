import { Module } from '@nestjs/common';
import { UserPermissionsService } from './userpermissions.service';
import { UserPermissionsController } from './userpermissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissions } from './entities/userpermission.entity';
import { User } from 'src/users/entities/user.entity';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { CheckPermissionService } from 'src/guards/permissions/check-permission';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermissions, User, Permissions])],
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService, CheckPermissionService]
})
export class UserpermissionsModule {}
