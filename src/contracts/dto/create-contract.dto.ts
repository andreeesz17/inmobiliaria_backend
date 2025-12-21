import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsNumber()
  @IsNotEmpty()
  propertyId: number;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}