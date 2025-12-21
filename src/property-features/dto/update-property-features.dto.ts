import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyFeaturesDto } from './create-property-features.dto';

export class UpdatePropertyFeaturesDto extends PartialType(
  CreatePropertyFeaturesDto,
) {}
