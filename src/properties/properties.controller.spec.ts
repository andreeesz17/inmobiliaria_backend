import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { CreatePropertiesDto } from './dto/create-properties.dto';
import { UpdatePropertiesDto } from './dto/update-properties.dto';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  
  const mockPropertiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una propiedad', async () => {
      const createDto: CreatePropertiesDto = {
        title: 'Casa en el centro',
        description: 'Hermosa casa',
        type: 'Casa',
        price: 150000,
        address: 'Calle Principal 123'
      };

      const mockProperty = { id: 1, ...createDto };
      mockPropertiesService.create.mockResolvedValue(mockProperty);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockProperty);
      expect(mockPropertiesService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las propiedades', async () => {
      const mockProperties = [
        { id: 1, title: 'Casa 1' },
        { id: 2, title: 'Casa 2' }
      ];

      mockPropertiesService.findAll.mockResolvedValue(mockProperties);

      const result = await controller.findAll();

      expect(result).toEqual(mockProperties);
      expect(mockPropertiesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar propiedad por ID', async () => {
      const mockProperty = { id: 1, title: 'Casa específica' };
      mockPropertiesService.findOne.mockResolvedValue(mockProperty);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockProperty);
      expect(mockPropertiesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('debería actualizar propiedad', async () => {
      const updateDto: UpdatePropertiesDto = { title: 'Casa actualizada' };
      const mockProperty = { id: 1, title: 'Casa actualizada' };
      
      mockPropertiesService.update.mockResolvedValue(mockProperty);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(mockProperty);
      expect(mockPropertiesService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar propiedad', async () => {
      const mockProperty = { id: 1, title: 'Casa eliminada' };
      mockPropertiesService.remove.mockResolvedValue(mockProperty);

      const result = await controller.remove('1');

      expect(result).toEqual(mockProperty);
      expect(mockPropertiesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
