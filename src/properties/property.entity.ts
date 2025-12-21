import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { PropertyFeature } from '../property-features/property-feature.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 50 })
  type: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({ length: 300 })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => PropertyFeature, feature => feature.properties)
  @JoinTable({
    name: 'property_property_features',
    joinColumn: {
      name: 'property_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'feature_id',
      referencedColumnName: 'id'
    }
  })
  features: PropertyFeature[];
}
