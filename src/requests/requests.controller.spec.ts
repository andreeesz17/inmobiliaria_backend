import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { CreateRequestDto, TipoOperacion } from './dto/create-request.dto';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  
  const mockRequestsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: mockRequestsService,
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una solicitud', async () => {
      const createDto: CreateRequestDto = {
        direccion: 'Calle Falsa 123',
        precio: 150000,
        num_habitaciones: 3,
        tipo_operacion: TipoOperacion.VENTA,
        nombre_cliente: 'Juan Pérez',
        email_cliente: 'juan@test.com'
      };

      const mockResult = {
        statusCode: 201,
        message: 'Solicitud registrada exitosamente',
        data: { _id: 'property-id-123', ...createDto }
      };

      mockRequestsService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(mockRequestsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las solicitudes', async () => {
      const mockRequests = [
        { _id: '1', direccion: 'Calle 1', precio: 100000 },
        { _id: '2', direccion: 'Calle 2', precio: 200000 }
      ];
      
      const mockResult = {
        statusCode: 200,
        message: 'Solicitudes obtenidas exitosamente',
        data: mockRequests
      };

      mockRequestsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockRequestsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar solicitud por ID', async () => {
      const mockRequest = { _id: 'property-id-123', direccion: 'Calle Falsa 123', precio: 150000 };
      const mockResult = {
        statusCode: 200,
        message: 'Solicitud obtenida exitosamente',
        data: mockRequest
      };

      mockRequestsService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne('property-id-123');

      expect(result).toEqual(mockResult);
      expect(mockRequestsService.findOne).toHaveBeenCalledWith('property-id-123');
    });
  });
});
