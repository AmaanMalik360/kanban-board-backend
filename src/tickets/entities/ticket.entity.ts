import { Phases } from 'src/phases/entities/phase.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({name: 'tickets'})
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  completed: boolean;

  @Column()
  order: number;
  
  @Column({ name: 'user_id'})
  user_id: number;
  
  @Column({ name: 'phase_id'})
  phase_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  
  // Relationship with Users
  @ManyToOne(() => User, (user) => user.tickets, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User[];
 
  // Relationship with Phases
  @ManyToOne(() => Phases, (phase) => phase.tickets, { cascade: true })
  @JoinColumn({ name: 'phase_id' })
  phase: Phases[];
  
}
