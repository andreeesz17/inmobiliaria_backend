import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contractNumber: string;

  @Column()
  transactionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column('text')
  terms: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  digitalHash: string;

  @Column()
  status: string;

  @Column()
  createdAt: Date;
}