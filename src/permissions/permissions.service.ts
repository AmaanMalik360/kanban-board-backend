import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Permissions } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions) private permissionRepository: Repository<Permissions>
  ){}

  async findAllPermissions() {
    try {
      // Fetch all movies from the database
      const permissions = await this.permissionRepository.find();
      return { permissions };
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
