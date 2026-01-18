import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { MailService } from '../mail/mail.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockContractsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};


const mockMailService = {
  sendMail: jest.fn(),
};

describe('ContractsService', () => {
  let service: ContractsService;
  let repository: Repository<Contract>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractsRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    repository = module.get<Repository<Contract>>(getRepositoryToken(Contract));
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un contrato exitosamente', async () => {
      
      const createDto: CreateContractDto = {
        transactionId: 'trans-123',
        clientId: 1,
        propertyId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      };

      const mockContract = {
        id: 'contract-123',
        contractNumber: 'CTR-20240101-1234',
        transactionId: 'trans-123',
        totalAmount: 0,
        duration: 12,
        terms: 'Términos y condiciones estándar...',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        digitalHash: 'hash123',
        status: 'active',
        createdAt: new Date()
      };

      mockContractsRepository.create.mockReturnValue(mockContract);
      mockContractsRepository.save.mockResolvedValue(mockContract);
      mockMailService.sendMail.mockResolvedValue({ messageId: 'email-123' });

      
      const result = await service.create(createDto);

      
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Contrato creado exitosamente',
        data: mockContract
      });
      
      expect(mockContractsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          contractNumber: expect.stringMatching(/^CTR-\d{8}-\d{4}$/),
          transactionId: 'trans-123',
          digitalHash: expect.any(String),
          status: 'active'
        })
      );
      expect(mockContractsRepository.save).toHaveBeenCalledWith(mockContract);
      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'cliente@example.com',
          subject: `Contrato CTR-20240101-1234`
        })
      );
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreateContractDto = {
        transactionId: 'trans-123',
        clientId: 1,
        propertyId: 1,
        startDate: new Date('2024-01-01')
      };

      mockContractsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los contratos', async () => {
      const mockContracts = [
        { id: '1', contractNumber: 'CTR-001', transactionId: 'trans-1' },
        { id: '2', contractNumber: 'CTR-002', transactionId: 'trans-2' }
      ];

      mockContractsRepository.find.mockResolvedValue(mockContracts);

      const result = await service.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Contratos obtenidos exitosamente',
        data: mockContracts
      });
      expect(mockContractsRepository.find).toHaveBeenCalled();
    });

    it('debería manejar errores al obtener contratos', async () => {
      mockContractsRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('debería encontrar contrato por ID', async () => {
      const mockContract = { 
        id: 'contract-123', 
        contractNumber: 'CTR-001',
        transactionId: 'trans-123'
      };

      mockContractsRepository.findOne.mockResolvedValue(mockContract);

      const result = await service.findOne('contract-123');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Contrato obtenido exitosamente',
        data: mockContract
      });
      expect(mockContractsRepository.findOne).toHaveBeenCalledWith({ where: { id: 'contract-123' } });
    });

    it('debería lanzar error 404 cuando no encuentra el contrato', async () => {
      mockContractsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(HttpException);
      await expect(service.findOne('nonexistent')).rejects.toMatchObject({
        message: 'Contrato no encontrado'
      });
    });
  });

  describe('findByUserId', () => {
    it('debería encontrar contratos por ID de usuario', async () => {
      const mockContracts = [
        { id: '1', contractNumber: 'CTR-001', transactionId: 'user-123' },
        { id: '2', contractNumber: 'CTR-002', transactionId: 'user-123' }
      ];

      mockContractsRepository.find.mockResolvedValue(mockContracts);

      const result = await service.findByUserId('user-123');

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Contratos del usuario obtenidos exitosamente',
        data: mockContracts
      });
      expect(mockContractsRepository.find).toHaveBeenCalledWith({ where: { transactionId: 'user-123' } });
    });

    it('debería manejar errores al buscar contratos por usuario', async () => {
      mockContractsRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findByUserId('user-123')).rejects.toThrow(HttpException);
    });
  });

  
  describe('private methods', () => {
    describe('generateContractNumber', () => {
      it('debería generar número de contrato con formato correcto', () => {
        const result = (service as any).generateContractNumber();
        
        expect(result).toMatch(/^CTR-\d{8}-\d{4}$/);
      });
    });

    describe('generateDigitalHash', () => {
      it('debería generar hash digital', () => {
        const result = (service as any).generateDigitalHash();
        
        
        expect(result.length).toBeGreaterThanOrEqual(20);
        expect(typeof result).toBe('string');
      });
    });

    describe('calculateDuration', () => {
      it('debería calcular duración en meses correctamente', () => {
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');
        
        const result = (service as any).calculateDuration(startDate, endDate);
        
        
        expect(result).toBe(13);
      });
    });
  });
});
