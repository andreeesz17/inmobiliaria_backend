import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  
  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('debería iniciar sesión exitosamente', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123'
      };

      const token = 'jwt-token-123';
      mockAuthService.login.mockResolvedValue(token);

      const result = await controller.login(loginDto);

      const expectedResponse = new SuccessResponseDto('Login exitoso', {
        access_token: token,
      });
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('debería lanzar UnauthorizedException cuando las credenciales son inválidas', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      mockAuthService.login.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(controller.login(loginDto)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('register', () => {
    it('debería registrar usuario exitosamente', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        role: Role.USER
      };

      const token = 'jwt-token-456';
      mockAuthService.register.mockResolvedValue(token);

      const result = await controller.register(createUserDto);

      const expectedResponse = new SuccessResponseDto('Registro exitoso', {
        access_token: token,
      });
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('debería lanzar BadRequestException cuando falla el registro', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        role: Role.USER
      };

      mockAuthService.register.mockResolvedValue(null);

      await expect(controller.register(createUserDto)).rejects.toThrow(BadRequestException);
      await expect(controller.register(createUserDto)).rejects.toThrow('Error al registrar usuario');
    });
  });
});
