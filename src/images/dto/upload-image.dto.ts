import { IsNumber, IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @IsNumber()
  @IsNotEmpty()
  id_casa: number;
}
