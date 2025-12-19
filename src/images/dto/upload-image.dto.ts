import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @IsNumber()
  @IsNotEmpty()
  id_casa: number;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsNumber()
  size: number;
}