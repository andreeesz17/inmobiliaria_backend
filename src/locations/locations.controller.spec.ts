import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Locations } from './location.entity';
import { Repository } from 'typeorm';
import { CreateLocationsDto } from './dto/create-locations.dto';
import { UpdateLocationsDto } from './dto/update-locations.dto';
import { NotFoundException } from '@nestjs/common';


const mockLocationsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: Repository<Locations>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Locations),
          useValue: mockLocationsRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<Repository<Locations>>(getRepositoryToken(Locations));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una ubicación exitosamente', async () => {
      
      const createDto: CreateLocationsDto = {
        name: 'Centro Comercial',
        address: 'Av. Principal 123',
        city: 'Ciudad Ejemplo'
      };

      const mockLocation = {
        id: 1,
        ...createDto
      };

      mockLocationsRepository.create.mockReturnValue(mockLocation);
      mockLocationsRepository.save.mockResolvedValue(mockLocation);

      
      const result = await service.create(createDto);

      
      expect(result).toEqual(mockLocation);
      expect(mockLocationsRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockLocationsRepository.save).toHaveBeenCalledWith(mockLocation);
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreateLocationsDto = {
        name: 'Centro Comercial',
        address: 'Av. Principal 123',
        city: 'Ciudad Ejemplo'
      };

      mockLocationsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las ubicaciones', async () => {
      const mockLocations = [
        { id: 1, name: 'Ubicación 1', city: 'Ciudad 1' },
        { id: 2, name: 'Ubicación 2', city: 'Ciudad 2' }
      ];

      mockLocationsRepository.find.mockResolvedValue(mockLocations);

      const result = await service.findAll();

      expect(result).toEqual(mockLocations);
      expect(mockLocationsRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería encontrar ubicación por ID', async () => {
      const mockLocation = { 
        id: 1, 
        name: 'Centro Comercial',
        city: 'Ciudad Ejemplo'
      };

      mockLocationsRepository.findOne.mockResolvedValue(mockLocation);

      const result = await service.findOne(1);

      expect(result).toEqual(mockLocation);
      expect(mockLocationsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debería lanzar NotFoundException cuando no encuentra la ubicación', async () => {
      mockLocationsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Location not found');
    });
  });

  describe('update', () => {
    it('debería actualizar ubicación exitosamente', async () => {
      const updateDto: UpdateLocationsDto = { name: 'Ubicación actualizada' };
      const existingLocation = { 
        id: 1, 
        name: 'Ubicación vieja',
        address: 'Dirección',
        city: 'Ciudad'
      } as unknown as Locations;
      const updatedLocation = { 
        id: 1, 
        name: 'Ubicación actualizada',
        address: 'Dirección',
        city: 'Ciudad'
      } as unknown as Locations;

      mockLocationsRepository.findOne.mockResolvedValue(existingLocation);
      mockLocationsRepository.save.mockResolvedValue(updatedLocation);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedLocation);
      expect(mockLocationsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockLocationsRepository.save).toHaveBeenCalledWith(updatedLocation);
    });
  });

  describe('remove', () => {
    it('debería eliminar ubicación exitosamente', async () => {
      const mockLocation = { 
        id: 1, 
        name: 'Ubicación a eliminar',
        address: 'Dirección',
        city: 'Ciudad'
      } as unknown as Locations;

      mockLocationsRepository.findOne.mockResolvedValue(mockLocation);
      mockLocationsRepository.remove.mockResolvedValue(mockLocation);

      const result = await service.remove(1);

      expect(result).toEqual(mockLocation);
      expect(mockLocationsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockLocationsRepository.remove).toHaveBeenCalledWith(mockLocation);
    });
  });
});