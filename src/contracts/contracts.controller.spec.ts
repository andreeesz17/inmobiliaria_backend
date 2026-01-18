import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  
  const mockContractsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockContractsService,
        },
      ],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un contrato', async () => {
      const createDto: CreateContractDto = {
        transactionId: 'trans-123',
        clientId: 1,
        propertyId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      };

      const mockResult = {
        statusCode: 201,
        message: 'Contrato creado exitosamente',
        data: { id: 'contract-123', contractNumber: 'CTR-001' }
      };

      mockContractsService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(mockContractsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los contratos', async () => {
      const mockContracts = [
        { id: '1', contractNumber: 'CTR-001' },
        { id: '2', contractNumber: 'CTR-002' }
      ];
      
      const mockResult = {
        statusCode: 200,
        message: 'Contratos obtenidos exitosamente',
        data: mockContracts
      };

      mockContractsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockContractsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar contrato por ID', async () => {
      const mockContract = { id: 'contract-123', contractNumber: 'CTR-001' };
      const mockResult = {
        statusCode: 200,
        message: 'Contrato obtenido exitosamente',
        data: mockContract
      };

      mockContractsService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne('contract-123');

      expect(result).toEqual(mockResult);
      expect(mockContractsService.findOne).toHaveBeenCalledWith('contract-123');
    });
  });

  describe('findByUserId', () => {
    it('debería retornar contratos por ID de usuario', async () => {
      const mockContracts = [
        { id: '1', contractNumber: 'CTR-001', transactionId: 'user-123' },
        { id: '2', contractNumber: 'CTR-002', transactionId: 'user-123' }
      ];
      
      const mockResult = {
        statusCode: 200,
        message: 'Contratos del usuario obtenidos exitosamente',
        data: mockContracts
      };

      mockContractsService.findByUserId.mockResolvedValue(mockResult);

      const result = await controller.findByUserId('user-123');

      expect(result).toEqual(mockResult);
      expect(mockContractsService.findByUserId).toHaveBeenCalledWith('user-123');
    });
  });
});
