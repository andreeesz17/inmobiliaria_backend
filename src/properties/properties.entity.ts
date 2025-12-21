import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  address: string;
}
