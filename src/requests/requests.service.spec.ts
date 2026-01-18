import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { getModelToken } from '@nestjs/mongoose';
import { Property } from './schemas/property.schema';
import { Visit } from './schemas/visit.schema';
import { Model } from 'mongoose';
import { CreateRequestDto, TipoOperacion } from './dto/create-request.dto';
import { HttpException, HttpStatus } from '@nestjs/common';


const mockPropertyModel = jest.fn().mockImplementation(function() {
  this.save = jest.fn();
  return this;
}) as any;

mockPropertyModel.find = jest.fn();
mockPropertyModel.findById = jest.fn();

const mockVisitModel = jest.fn().mockImplementation(function() {
  this.save = jest.fn();
  return this;
}) as any;

mockVisitModel.find = jest.fn();
mockVisitModel.findById = jest.fn();

describe('RequestsService', () => {
  let service: RequestsService;
  let propertyModel: Model<Property>;
  let visitModel: Model<Visit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getModelToken(Property.name),
          useValue: mockPropertyModel,
        },
        {
          provide: getModelToken(Visit.name),
          useValue: mockVisitModel,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    propertyModel = module.get<Model<Property>>(getModelToken(Property.name));
    visitModel = module.get<Model<Visit>>(getModelToken(Visit.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una solicitud exitosamente', async () => {
      const createDto: CreateRequestDto = {
        direccion: 'Calle Falsa 123',
        precio: 150000,
        num_habitaciones: 3,
        tipo_operacion: TipoOperacion.VENTA,
        nombre_cliente: 'Juan Pérez',
        email_cliente: 'juan@test.com'
      };

      const mockSavedProperty = {
        _id: 'property-id-123',
        ...createDto,
        createdAt: new Date()
      };

      const mockPropertyInstance = {
        save: jest.fn().mockResolvedValue(mockSavedProperty)
      };

      mockPropertyModel.mockImplementation(() => mockPropertyInstance);

      const result = await service.create(createDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Solicitud registrada exitosamente',
        data: mockSavedProperty
      });
      
      expect(mockPropertyModel).toHaveBeenCalledWith(expect.objectContaining({
        ...createDto,
        createdAt: expect.any(Date)
      }));
      expect(mockPropertyInstance.save).toHaveBeenCalled();
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreateRequestDto = {
        direccion: 'Calle Falsa 123',
        precio: 150000,
        num_habitaciones: 3,
        tipo_operacion: TipoOperacion.VENTA,
        nombre_cliente: 'Juan Pérez',
        email_cliente: 'juan@test.com'
      };

      const mockPropertyInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      mockPropertyModel.mockImplementation(() => mockPropertyInstance);

      await expect(service.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las solicitudes', async () => {
      const mockProperties = [
        { _id: '1', direccion: 'Calle 1', precio: 100000 },
        { _id: '2', direccion: 'Calle 2', precio: 200000 }
      ];

      (mockPropertyModel.find as jest.Mock).mockResolvedValue(mockProperties);

      const result = await service.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Solicitudes obtenidas exitosamente',
        data: mockProperties
      });
      expect(mockPropertyModel.find).toHaveBeenCalled();
    });

    it('debería manejar errores al obtener solicitudes', async () => {
      (mockPropertyModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('debería encontrar solicitud por ID', async () => {
      const mockProperty = { 
        _id: 'property-id-123', 
        direccion: 'Calle Falsa 123',
        precio: 150000
      };

      (mockPropertyModel.findById as jest.Mock).mockResolvedValue(mockProperty);

      const result = await service.findOne('property-id-123');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Solicitud obtenida exitosamente',
        data: mockProperty
      });
      expect(mockPropertyModel.findById).toHaveBeenCalledWith('property-id-123');
    });

    it('debería lanzar error 404 cuando no encuentra la solicitud', async () => {
      (mockPropertyModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(HttpException);
      await expect(service.findOne('nonexistent')).rejects.toMatchObject({
        message: 'Solicitud no encontrada'
      });
    });

    it('debería manejar errores al buscar solicitud', async () => {
      (mockPropertyModel.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.findOne('property-id-123')).rejects.toThrow(HttpException);
    });
  });
});
