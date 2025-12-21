import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  role?: Role;
}
