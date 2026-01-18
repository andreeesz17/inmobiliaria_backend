import { Test, TestingModule } from '@nestjs/testing';
import { PropertyFeaturesController } from './property-features.controller';
import { PropertyFeaturesService } from './property-features.service';
import { CreatePropertyFeaturesDto } from './dto/create-property-features.dto';
import { UpdatePropertyFeaturesDto } from './dto/update-property-features.dto';

describe('PropertyFeaturesController', () => {
  let controller: PropertyFeaturesController;
  let service: PropertyFeaturesService;

  
  const mockPropertyFeaturesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyFeaturesController],
      providers: [
        {
          provide: PropertyFeaturesService,
          useValue: mockPropertyFeaturesService,
        },
      ],
    }).compile();

    controller = module.get<PropertyFeaturesController>(PropertyFeaturesController);
    service = module.get<PropertyFeaturesService>(PropertyFeaturesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una característica', async () => {
      const createDto: CreatePropertyFeaturesDto = {
        name: 'Piscina',
        description: 'Piscina privada',
        isActive: true
      };

      const mockFeature = { id: 1, ...createDto };
      mockPropertyFeaturesService.create.mockResolvedValue(mockFeature);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las características', async () => {
      const mockFeatures = [
        { id: 1, name: 'Característica 1', isActive: true },
        { id: 2, name: 'Característica 2', isActive: true }
      ];

      mockPropertyFeaturesService.findAll.mockResolvedValue(mockFeatures);

      const result = await controller.findAll();

      expect(result).toEqual(mockFeatures);
      expect(mockPropertyFeaturesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar característica por ID', async () => {
      const mockFeature = { id: 1, name: 'Característica específica', isActive: true };
      mockPropertyFeaturesService.findOne.mockResolvedValue(mockFeature);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('debería actualizar característica', async () => {
      const updateDto: UpdatePropertyFeaturesDto = { name: 'Característica actualizada' };
      const mockFeature = { id: 1, name: 'Característica actualizada', isActive: true };
      
      mockPropertyFeaturesService.update.mockResolvedValue(mockFeature);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar característica', async () => {
      const mockFeature = { id: 1, name: 'Característica eliminada', isActive: true };
      mockPropertyFeaturesService.remove.mockResolvedValue(mockFeature);

      const result = await controller.remove('1');

      expect(result).toEqual(mockFeature);
      expect(mockPropertyFeaturesService.remove).toHaveBeenCalledWith(1);
    });
  });
});