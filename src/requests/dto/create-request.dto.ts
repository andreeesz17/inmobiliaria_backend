import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export enum TipoOperacion {
  VENTA = 'Venta',
  ALQUILER = 'Alquiler',
}

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  num_habitaciones: number;

  @IsEnum(TipoOperacion)
  @IsNotEmpty()
  tipo_operacion: TipoOperacion;

  @IsString()
  @IsNotEmpty()
  nombre_cliente: string;

  @IsString()
  @IsNotEmpty()
  email_cliente: string;
}