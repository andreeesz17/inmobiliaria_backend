import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from './property.entity';
import { Repository } from 'typeorm';
import { CreatePropertiesDto } from './dto/create-properties.dto';
import { UpdatePropertiesDto } from './dto/update-properties.dto';
import { NotFoundException } from '@nestjs/common';


const mockPropertiesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('PropertiesService', () => {
  let service: PropertiesService;
  let repository: Repository<Property>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertiesRepository,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    repository = module.get<Repository<Property>>(getRepositoryToken(Property));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una propiedad exitosamente', async () => {
      
      const createDto: CreatePropertiesDto = {
        title: 'Casa en el centro',
        description: 'Hermosa casa ubicada en zona céntrica',
        type: 'Casa',
        price: 150000,
        address: 'Calle Principal 123'
      };

      const mockProperty = {
        id: 1,
        ...createDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: []
      };

      mockPropertiesRepository.create.mockReturnValue(mockProperty);
      mockPropertiesRepository.save.mockResolvedValue(mockProperty);

      
      const result = await service.create(createDto);

      
      expect(result).toEqual(mockProperty);
      expect(mockPropertiesRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockPropertiesRepository.save).toHaveBeenCalledWith(mockProperty);
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreatePropertiesDto = {
        title: 'Casa en el centro',
        description: 'Hermosa casa',
        type: 'Casa',
        price: 150000,
        address: 'Calle 123'
      };

      mockPropertiesRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las propiedades con sus features', async () => {
      const mockProperties = [
        { id: 1, title: 'Casa 1', features: [] },
        { id: 2, title: 'Casa 2', features: [] }
      ];

      mockPropertiesRepository.find.mockResolvedValue(mockProperties);

      const result = await service.findAll();

      expect(result).toEqual(mockProperties);
      expect(mockPropertiesRepository.find).toHaveBeenCalledWith({ relations: ['features'] });
    });
  });

  describe('findOne', () => {
    it('debería encontrar propiedad por ID con sus features', async () => {
      const mockProperty = { 
        id: 1, 
        title: 'Casa en el centro',
        features: [{ id: 1, name: 'Jardín' }]
      };

      mockPropertiesRepository.findOne.mockResolvedValue(mockProperty);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProperty);
      expect(mockPropertiesRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        relations: ['features']
      });
    });

    it('debería lanzar NotFoundException cuando no encuentra la propiedad', async () => {
      mockPropertiesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Property not found');
    });
  });

  describe('update', () => {
    it('debería actualizar propiedad exitosamente', async () => {
      const updateDto: UpdatePropertiesDto = { title: 'Casa actualizada' };
      const existingProperty = { 
        id: 1, 
        title: 'Casa vieja', 
        description: 'Descripción',
        type: 'Casa',
        price: 100000,
        address: 'Dirección',
        features: [] 
      } as unknown as Property;
      const updatedProperty = { 
        id: 1, 
        title: 'Casa actualizada', 
        description: 'Descripción',
        type: 'Casa',
        price: 100000,
        address: 'Dirección',
        features: [] 
      } as unknown as Property;

      mockPropertiesRepository.findOne.mockResolvedValue(existingProperty);
      mockPropertiesRepository.save.mockResolvedValue(updatedProperty);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedProperty);
      expect(mockPropertiesRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        relations: ['features']
      });
      expect(mockPropertiesRepository.save).toHaveBeenCalledWith(updatedProperty);
    });
  });

  describe('remove', () => {
    it('debería eliminar propiedad exitosamente', async () => {
      const mockProperty = { id: 1, title: 'Casa a eliminar' } as Property;

      mockPropertiesRepository.findOne.mockResolvedValue(mockProperty);
      mockPropertiesRepository.remove.mockResolvedValue(mockProperty);

      const result = await service.remove(1);

      expect(result).toEqual(mockProperty);
      expect(mockPropertiesRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        relations: ['features']
      });
      expect(mockPropertiesRepository.remove).toHaveBeenCalledWith(mockProperty);
    });
  });
});
