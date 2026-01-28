import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Entity('appointments')
export class Appointments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientName: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  agentId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'agentId' })
  agent: User;
}
