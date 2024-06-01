import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tickets } from './entities/ticket.entity';
import { Phases } from 'src/phases/entities/phase.entity';
import { FileUploadMiddleware } from 'src/middlewares/file-upload/file-upload.middleware';
import { CheckPermissionService } from 'src/guards/permissions/check-permission';
import { UserPermissions } from 'src/userpermissions/entities/userpermission.entity';
import { Permissions } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tickets, Phases, UserPermissions, Permissions])],
  controllers: [TicketsController],
  providers: [TicketsService, CheckPermissionService],
})
export class TicketsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(FileUploadMiddleware)
    .forRoutes('tickets')
  }
}
