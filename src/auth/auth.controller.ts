import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return new SuccessResponseDto('Login exitoso', {
      access_token: token,
    });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.register(createUserDto);
    if (!token) {
      throw new BadRequestException('Error al registrar usuario');
    }

    return new SuccessResponseDto('Registro exitoso', {
      access_token: token,
    });
  }
}
