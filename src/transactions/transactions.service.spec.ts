import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto, TipoTransaccion } from './dto/create-transaction.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockTransactionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una transacción exitosamente', async () => {
      const createDto: CreateTransactionDto = {
        id_casa: 1,
        direccion: 'Calle falsa 123',
        id_cliente: 1,
        nombre_cliente: 'Juan Pérez',
        monto: 100000,
        tipo_transaccion: TipoTransaccion.VENTA,
        email_cliente: 'juan@test.com'
      };

      const mockTransaction = {
        id: 'uuid-123',
        ...createDto,
        estado: 'completada',
        fecha_transaccion: new Date()
      };

      mockTransactionRepository.findOne.mockResolvedValue(null);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Transacción registrada exitosamente',
        data: mockTransaction
      });
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...createDto,
        estado: 'completada',
        fecha_transaccion: expect.any(Date)
      }));
    });

    it('debería lanzar error cuando ya existe una transacción similar', async () => {
      const createDto: CreateTransactionDto = {
        id_casa: 1,
        direccion: 'Calle falsa 123',
        id_cliente: 1,
        nombre_cliente: 'Juan Pérez',
        monto: 100000,
        tipo_transaccion: TipoTransaccion.VENTA,
        email_cliente: 'juan@test.com'
      };

      const existingTransaction = { id: 'uuid-123', ...createDto };
      mockTransactionRepository.findOne.mockResolvedValue(existingTransaction);

      await expect(service.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las transacciones', async () => {
      const mockTransactions = [
        { id: '1', id_casa: 1, direccion: 'Calle 1' },
        { id: '2', id_casa: 2, direccion: 'Calle 2' }
      ];

      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Transacciones obtenidas exitosamente',
        data: mockTransactions
      });
    });
  });

  
});
