
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from '../common/dto/query.dto';
import { Role } from '../common/enums/role.enum';
import { SuccessResponseDto } from '../common/dto/response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  
  const mockUsersService = {
    paginate: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar lista paginada de usuarios', async () => {
      const mockUsers = {
        items: [{ id: 1, username: 'testuser' }],
        meta: { currentPage: 1, itemCount: 1, itemsPerPage: 10 }
      };
      
      const queryDto: QueryDto = { page: 1, limit: 10 };
      
      mockUsersService.paginate.mockResolvedValue(mockUsers);
      
      const result = await controller.findAll(queryDto);
      
      const expectedResponse = new SuccessResponseDto('Lista de usuarios', mockUsers);
      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.paginate).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('debería retornar usuario por ID', async () => {
      const mockUser = { id: 1, username: 'testuser' } as User;
      mockUsersService.findOne.mockResolvedValue(mockUser);
      
      const result = await controller.findOne(1);
      
      const expectedResponse = new SuccessResponseDto('Usuario encontrado', mockUser);
      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  
});
