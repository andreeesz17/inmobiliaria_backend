import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
