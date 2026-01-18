import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Pagination } from 'nestjs-typeorm-paginate';


jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn()
}));

const { paginate } = require('nestjs-typeorm-paginate');

const mockCategoriesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
  
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una categoría exitosamente', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Residencial'
      };

      const mockCategory = {
        id: 1,
        ...createDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCategoriesRepository.create.mockReturnValue(mockCategory);
      mockCategoriesRepository.save.mockResolvedValue(mockCategory);

      
      const result = await service.create(createDto);

      
      expect(result).toEqual(mockCategory);
      expect(mockCategoriesRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockCategoriesRepository.save).toHaveBeenCalledWith(mockCategory);
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Residencial'
      };

      mockCategoriesRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('paginate', () => {
    it('debería retornar categorías paginadas', async () => {
      const mockPagination: Pagination<Category> = {
        items: [
          { id: 1, name: 'Categoria 1', isActive: true } as Category,
          { id: 2, name: 'Categoria 2', isActive: true } as Category
        ],
        meta: {
          currentPage: 1,
          itemCount: 2,
          itemsPerPage: 10,
          totalItems: 2,
          totalPages: 1
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: ''
        }
      };

      (paginate as jest.Mock).mockResolvedValue(mockPagination);

      const result = await service.paginate(1, 10);
      
      expect(result).toEqual(mockPagination);
      expect(paginate).toHaveBeenCalledWith(
        mockCategoriesRepository,
        { page: 1, limit: 10 }
      );
    });
  });

  describe('findOne', () => {
    it('debería encontrar categoría por ID', async () => {
      const mockCategory = { 
        id: 1, 
        name: 'Residencial',
        isActive: true
      } as Category;

      mockCategoriesRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debería retornar null cuando no encuentra la categoría', async () => {
      mockCategoriesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debería actualizar categoría exitosamente', async () => {
      const updateDto: UpdateCategoryDto = { name: 'Categoria actualizada' };
      const existingCategory = { 
        id: 1, 
        name: 'Categoria vieja',
        isActive: true
      } as Category;
      const updatedCategory = { 
        id: 1, 
        name: 'Categoria actualizada',
        isActive: true
      } as Category;

      mockCategoriesRepository.update.mockResolvedValue({ affected: 1 });
      mockCategoriesRepository.findOne.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedCategory);
      expect(mockCategoriesRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('remove', () => {
    it('debería eliminar categoría exitosamente', async () => {
      mockCategoriesRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toBe(true);
      expect(mockCategoriesRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debería retornar false cuando no encuentra la categoría', async () => {
      mockCategoriesRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBe(false);
    });
  });
});
