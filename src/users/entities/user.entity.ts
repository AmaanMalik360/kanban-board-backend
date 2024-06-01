import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserPermissions } from 'src/userpermissions/entities/userpermission.entity';
import { Tickets } from 'src/tickets/entities/ticket.entity';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  is_admin: boolean;
  
  @CreateDateColumn
  ({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  
  @OneToMany(() => UserPermissions, (userPermissions) => userPermissions.user, { cascade: true })
  userPermissions: UserPermissions[];

  @OneToMany(() => Tickets, (tickets) => tickets.user)
  tickets: Tickets[];

}
