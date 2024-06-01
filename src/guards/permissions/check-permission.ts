// check-permissions.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { UserPermissions } from 'src/userpermissions/entities/userpermission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckPermissionService {
  
  constructor(
    @InjectRepository(Permissions)
    private permissionRepository: Repository<Permissions>,
    @InjectRepository(UserPermissions)
    private userPermissionRepository: Repository<UserPermissions>,
  ){}

  async hasPermission(permissionName: string, userId: number) {
    // Your logic to determine whether the user has the 'Write' permission
    const Permission = await this.permissionRepository.findOne({ where: { name: permissionName } });
    
    const UserPermission = await this.userPermissionRepository.findOne({
      where: { user: {id: userId}, permission: { id: Permission.id} },
    });

    // Check if the user has write permission
    if (!UserPermission) {
     return false;
    }

    return true;
  }
}
