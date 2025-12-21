import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('property_features')
export class PropertyFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
