import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  id_casa: number;

  @Column()
  direccion: string;

  @Column('int')
  id_cliente: number;

  @Column()
  nombre_cliente: string;

  @Column('decimal')
  monto: number;

  @Column()
  tipo_transaccion: string;

  @Column()
  email_cliente: string;

  @Column()
  estado: string;

  @Column({ nullable: true })
  fecha_transaccion: Date;
  
  @Column({ nullable: true })
  createdAt: Date;
}