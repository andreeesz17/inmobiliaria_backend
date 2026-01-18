import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TipoTransaccion } from './dto/create-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCliente: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una transacción', async () => {
      const createDto: CreateTransactionDto = {
        id_casa: 1,
        direccion: 'Calle falsa 123',
        id_cliente: 1,
        nombre_cliente: 'Juan Pérez',
        monto: 100000,
        tipo_transaccion: TipoTransaccion.VENTA,
        email_cliente: 'juan@test.com'
      };

      const expectedResult = {
        statusCode: 201,
        message: 'Transacción registrada exitosamente',
        data: { id: 'uuid-123', ...createDto }
      };

      mockTransactionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(mockTransactionsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las transacciones', async () => {
      const mockTransactions = [
        { id: '1', id_casa: 1 },
        { id: '2', id_casa: 2 }
      ];
      
      const expectedResult = {
        statusCode: 200,
        message: 'Transacciones obtenidas exitosamente',
        data: mockTransactions
      };

      mockTransactionsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockTransactionsService.findAll).toHaveBeenCalled();
    });
  });

  
});
