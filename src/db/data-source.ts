import {DataSourceOptions,DataSource}  from "typeorm"
import { User } from "src/users/entities/user.entity" 
import { UserPermissions } from "src/userpermissions/entities/userpermission.entity"
import { Permissions } from "src/permissions/entities/permission.entity"
import { Phases } from "src/phases/entities/phase.entity"
import { Tickets } from "src/tickets/entities/ticket.entity"

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'kanban_board_db',
    entities: [UserPermissions, Permissions, User, Phases, Tickets],
    synchronize: false,
    migrations:['dist/db/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource;
