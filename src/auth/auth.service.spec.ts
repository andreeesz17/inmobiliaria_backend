import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';


jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashed_password')
}));


const mockUsersService = {
  findByUsername: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        role: Role.USER
      } as User;

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token-123');

      const result = await service.login(loginDto);

      expect(result).toBe('jwt-token-123');
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id: 1,
        username: 'testuser',
        role: Role.USER
      });
    });

    it('debería retornar null cuando el usuario no existe', async () => {
      const loginDto: LoginDto = {
        username: 'nonexistent',
        password: 'password123'
      };

      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('nonexistent');
    });

    it('debería retornar null cuando la contraseña es inválida', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'correct_hashed_password',
        role: Role.USER
      } as User;

      
      jest.requireMock('bcrypt').compare.mockResolvedValue(false);
      
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
      expect(jest.requireMock('bcrypt').compare).toHaveBeenCalledWith('wrongpassword', 'correct_hashed_password');
    });
  });

  describe('register', () => {
    it('debería registrar usuario exitosamente', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        role: Role.USER
      };

      const mockUser = {
        id: 2,
        username: 'newuser',
        password: 'hashed_password',
        role: Role.USER
      } as User;

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token-456');

      const result = await service.register(createUserDto);

      expect(result).toBe('jwt-token-456');
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id: 2,
        username: 'newuser',
        role: Role.USER
      });
    });

    it('debería retornar null cuando falla la creación del usuario', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        role: Role.USER
      };

      mockUsersService.create.mockResolvedValue(null);

      const result = await service.register(createUserDto);

      expect(result).toBeNull();
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
