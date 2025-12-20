import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
