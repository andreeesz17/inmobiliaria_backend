import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePropertyFeaturesDto {
  @IsNotEmpty()
  @IsString()
  name: string; 
}
