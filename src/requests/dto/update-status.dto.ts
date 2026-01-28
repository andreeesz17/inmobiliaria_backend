import { IsEnum } from 'class-validator';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
