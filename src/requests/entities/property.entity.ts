import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  direccion: string;

  @Column('decimal')
  precio: number;

  @Column('int')
  num_habitaciones: number;

  @Column()
  tipo_operacion: string;

  @Column()
  nombre_cliente: string;

  @Column()
  email_cliente: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ nullable: true })
  createdAt: Date;
}