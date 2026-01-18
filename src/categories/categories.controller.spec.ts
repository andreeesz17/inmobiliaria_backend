import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryDto } from '../common/dto/query.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  
  const mockCategoriesService = {
    create: jest.fn(),
    paginate: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una categoría', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Residencial'
      };

      const mockCategory = { id: 1, ...createDto, isActive: true };
      const serviceResult = mockCategory;
      mockCategoriesService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(createDto);

      const expectedResponse = new SuccessResponseDto('Categoría creada', mockCategory);
      expect(result).toEqual(expectedResponse);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar categorías paginadas', async () => {
      const queryDto: QueryDto = { page: 1, limit: 10 };
      const mockPagination = {
        items: [{ id: 1, name: 'Categoria 1' }],
        meta: { currentPage: 1, itemCount: 1, itemsPerPage: 10 }
      };

      mockCategoriesService.paginate.mockResolvedValue(mockPagination);

      const result = await controller.findAll(queryDto);

      const expectedResponse = new SuccessResponseDto('Lista de categorías', mockPagination);
      expect(result).toEqual(expectedResponse);
      expect(mockCategoriesService.paginate).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('debería retornar categoría por ID', async () => {
      const mockCategory = { id: 1, name: 'Categoria específica', isActive: true };
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne(1);

      const expectedResponse = new SuccessResponseDto('Categoría encontrada', mockCategory);
      expect(result).toEqual(expectedResponse);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('debería actualizar categoría', async () => {
      const updateDto: UpdateCategoryDto = { name: 'Categoria actualizada' };
      const mockCategory = { id: 1, name: 'Categoria actualizada', isActive: true };
      
      mockCategoriesService.update.mockResolvedValue(mockCategory);

      const result = await controller.update(1, updateDto);

      const expectedResponse = new SuccessResponseDto('Categoría actualizada', mockCategory);
      expect(result).toEqual(expectedResponse);
      expect(mockCategoriesService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar categoría', async () => {
      mockCategoriesService.remove.mockResolvedValue(true);

      const result = await controller.remove(1);

      const expectedResponse = new SuccessResponseDto('Categoría eliminada', true);
      expect(result).toEqual(expectedResponse);
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
