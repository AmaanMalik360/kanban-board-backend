import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPermissions } from 'src/userpermissions/entities/userpermission.entity';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { EmailService } from 'src/helpers/mailer/mailer';
@Module({
  imports: [TypeOrmModule.forFeature([User, UserPermissions, Permissions])],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
