import { Module } from '@nestjs/common';
import { PropertyFeaturesController } from './property-features.controller';
import { PropertyFeaturesService } from './property-features.service';

@Module({
  controllers: [PropertyFeaturesController],
  providers: [PropertyFeaturesService]
})
export class PropertyFeaturesModule {}
