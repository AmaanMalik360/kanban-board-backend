import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserPermissions } from './entities/userpermission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { UserPermissionDto } from './dto/user-permission.dto';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Permissions)
    private permissionRepository: Repository<Permissions>,
    @InjectRepository(UserPermissions)
    private userPermissionRepository: Repository<UserPermissions>,
  ) {}

  async findAllUserPermissions() {
    try {
      // Fetch all movies from the database
      const userPermissions = await this.userPermissionRepository.find();
      return { userPermissions };
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePermission(adminId: number, userId: number, permissionId:number) :Promise<{ message: string }> 
  {
    try {
      
      // and also check if he is an admin
      const admin = await this.userRepository.findOne({where: {id: adminId}});
      if (!admin?.is_admin) {
        throw new HttpException("Unauthorized. Can't Access", HttpStatus.FORBIDDEN);
      }

      // Check if userId whose permission we are about to change exists and is not an admin
      const userToUpdate = await this.userRepository.findOne({where: {id: userId}});
      if (!userToUpdate || userToUpdate.is_admin) {
        throw new HttpException('Cannot change permissions for Admin users.', HttpStatus.FORBIDDEN);
      }

      // Check if the UserPermission already exists
      const existingUserPermission = await this.userPermissionRepository.findOne({ where: { user: {id: userId}, permission: {id: permissionId} } });

      // Get the permission name based on permissionId
      const permission = await this.permissionRepository.findOne({where: {id: permissionId}});
      const permissionName = permission ? permission.name : 'Unknown Permission';

      if (existingUserPermission) {
        // If the UserPermission exists, remove it from the UserPermission Collection
        await this.userPermissionRepository.remove(existingUserPermission);

        return { message: 'Permission removed successfully' };
      } 
      else {
        // If the UserPermission does not exist, add a new entry to the UserPermission Collection
        // If the movie is not in favorites, add it
        const newPermission = this.userPermissionRepository.create({
          user: userToUpdate,
          permission
        });
        await this.userPermissionRepository.save(newPermission);

        return { message: 'Permissions added successfully' };
      }
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
