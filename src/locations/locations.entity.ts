import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class Locations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;
}
