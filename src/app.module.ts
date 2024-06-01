import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { UserPermissions } from './userpermissions/entities/userpermission.entity';
import { Permissions } from './permissions/entities/permission.entity';
import { TicketsModule } from './tickets/tickets.module';
import { PhasesModule } from './phases/phases.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserpermissionsModule } from './userpermissions/userpermissions.module';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from './db/data-source';
import { Tickets } from './tickets/entities/ticket.entity';
import { Phases } from './phases/entities/phase.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserPermissions, Permissions, Tickets, Phases]),
    TypeOrmModule.forRoot(dataSourceOptions),
    PermissionsModule,
    UserpermissionsModule,
    UsersModule,
    TicketsModule,
    PhasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
