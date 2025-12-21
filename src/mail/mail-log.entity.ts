import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  relatedEntityType: string; // 'contract', 'transaction', etc.

  @Column({ nullable: true })
  relatedEntityId: string; // ID del contrato o transacción

  @Column({ default: 'sent' })
  status: string; // 'sent', 'failed'

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn()
  sentAt: Date;
}