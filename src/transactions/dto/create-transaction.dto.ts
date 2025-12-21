import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export enum TipoTransaccion {
  VENTA = 'Venta',
  ALQUILER = 'Alquiler',
}

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  id_casa: number;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsNumber()
  @IsNotEmpty()
  id_cliente: number;

  @IsString()
  @IsNotEmpty()
  nombre_cliente: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsEnum(TipoTransaccion)
  @IsNotEmpty()
  tipo_transaccion: TipoTransaccion;

  @IsString()
  @IsNotEmpty()
  email_cliente: string;
}