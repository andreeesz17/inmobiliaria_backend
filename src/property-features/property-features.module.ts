import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyFeature } from './property-features.entity';
import { PropertyFeaturesController } from './property-features.controller';
import { PropertyFeaturesService } from './property-features.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyFeature])],
  controllers: [PropertyFeaturesController],
  providers: [PropertyFeaturesService],
})
export class PropertyFeaturesModule {}
