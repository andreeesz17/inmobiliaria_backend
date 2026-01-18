import { Test, TestingModule } from '@nestjs/testing';
import { PropertyFeaturesService } from './property-features.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PropertyFeature } from './property-feature.entity';
import { Repository } from 'typeorm';
import { CreatePropertyFeaturesDto } from './dto/create-property-features.dto';
import { UpdatePropertyFeaturesDto } from './dto/update-property-features.dto';
import { NotFoundException } from '@nestjs/common';


const mockPropertyFeaturesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('PropertyFeaturesService', () => {
  let service: PropertyFeaturesService;
  let repository: Repository<PropertyFeature>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyFeaturesService,
        {
          provide: getRepositoryToken(PropertyFeature),
          useValue: mockPropertyFeaturesRepository,
        },
      ],
    }).compile();

    service = module.get<PropertyFeaturesService>(PropertyFeaturesService);
    repository = module.get<Repository<PropertyFeature>>(getRepositoryToken(PropertyFeature));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una característica exitosamente', async () => {
      const createDto: CreatePropertyFeaturesDto = {
        name: 'Piscina',
        description: 'Piscina privada',
        isActive: true
      };

      const mockFeature = {
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPropertyFeaturesRepository.create.mockReturnValue(mockFeature);
      mockPropertyFeaturesRepository.save.mockResolvedValue(mockFeature);

      const result = await service.create(createDto);

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockPropertyFeaturesRepository.save).toHaveBeenCalledWith(mockFeature);
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreatePropertyFeaturesDto = {
        name: 'Piscina',
        description: 'Piscina privada',
        isActive: true
      };

      mockPropertyFeaturesRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las características', async () => {
      const mockFeatures = [
        { id: 1, name: 'Característica 1', isActive: true },
        { id: 2, name: 'Característica 2', isActive: true }
      ];

      mockPropertyFeaturesRepository.find.mockResolvedValue(mockFeatures);

      const result = await service.findAll();

      expect(result).toEqual(mockFeatures);
      expect(mockPropertyFeaturesRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería encontrar característica por ID', async () => {
      const mockFeature = { 
        id: 1, 
        name: 'Piscina',
        isActive: true
      };

      mockPropertyFeaturesRepository.findOne.mockResolvedValue(mockFeature);

      const result = await service.findOne(1);

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debería lanzar NotFoundException cuando no encuentra la característica', async () => {
      mockPropertyFeaturesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Property feature not found');
    });
  });

  describe('update', () => {
    it('debería actualizar característica exitosamente', async () => {
      const updateDto: UpdatePropertyFeaturesDto = { name: 'Característica actualizada' };
      const existingFeature = { 
        id: 1, 
        name: 'Característica vieja',
        description: 'Descripción',
        isActive: true
      } as PropertyFeature;
      const updatedFeature = { 
        id: 1, 
        name: 'Característica actualizada',
        description: 'Descripción',
        isActive: true
      } as PropertyFeature;

      mockPropertyFeaturesRepository.findOne.mockResolvedValue(existingFeature);
      mockPropertyFeaturesRepository.save.mockResolvedValue(updatedFeature);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedFeature);
      expect(mockPropertyFeaturesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPropertyFeaturesRepository.save).toHaveBeenCalledWith(updatedFeature);
    });
  });

  describe('remove', () => {
    it('debería eliminar característica exitosamente', async () => {
      const mockFeature = { 
        id: 1, 
        name: 'Característica a eliminar',
        description: 'Descripción'
      } as PropertyFeature;

      mockPropertyFeaturesRepository.findOne.mockResolvedValue(mockFeature);
      mockPropertyFeaturesRepository.remove.mockResolvedValue(mockFeature);

      const result = await service.remove(1);

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPropertyFeaturesRepository.remove).toHaveBeenCalledWith(mockFeature);
    });
  });
});
