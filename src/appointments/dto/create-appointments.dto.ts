import { IsDateString, IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentsDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  agentId?: number;
}
