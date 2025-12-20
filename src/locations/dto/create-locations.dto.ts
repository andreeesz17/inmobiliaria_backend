import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}
