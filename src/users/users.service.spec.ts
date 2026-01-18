
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';


jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));


const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.USER
      };
      
      const mockUser = { id: 1, ...createUserDto, password: 'hashed_password' } as User;
      
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      
      const result = await service.create(createUserDto);

      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        username: 'testuser',
        password: 'hashed_password'
      }));
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.USER
      };
      
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));
      
      await expect(service.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('findByUsername', () => {
    it('debería encontrar usuario por username', async () => {
      const mockUser = { id: 1, username: 'testuser' } as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      
      const result = await service.findByUsername('testuser');
      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('debería retornar null cuando no encuentra el usuario', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      const result = await service.findByUsername('nonexistent');
      
      expect(result).toBeNull();
    });
  });

  
});
