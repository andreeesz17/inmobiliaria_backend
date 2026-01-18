import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  
  const mockAppointmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cita', async () => {
      const createDto: CreateAppointmentsDto = {
        clientName: 'Juan Pérez',
        email: 'juan@test.com',
        appointmentDate: '2024-12-01T10:00:00Z',
        description: 'Visita a propiedad'
      };

      const mockAppointment = { id: 1, ...createDto };
      mockAppointmentsService.create.mockResolvedValue(mockAppointment);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las citas', async () => {
      const mockAppointments = [
        { id: 1, clientName: 'Cliente 1', email: 'cliente1@test.com' },
        { id: 2, clientName: 'Cliente 2', email: 'cliente2@test.com' }
      ];

      mockAppointmentsService.findAll.mockResolvedValue(mockAppointments);

      const result = await controller.findAll();

      expect(result).toEqual(mockAppointments);
      expect(mockAppointmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar cita por ID', async () => {
      const mockAppointment = { id: 1, clientName: 'Cliente específico', email: 'cliente@test.com' };
      mockAppointmentsService.findOne.mockResolvedValue(mockAppointment);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('debería actualizar cita', async () => {
      const updateDto: UpdateAppointmentsDto = { clientName: 'Nombre actualizado' };
      const mockAppointment = { id: 1, clientName: 'Nombre actualizado', email: 'cliente@test.com' };
      
      mockAppointmentsService.update.mockResolvedValue(mockAppointment);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar cita', async () => {
      const mockAppointment = { id: 1, clientName: 'Cliente eliminado', email: 'cliente@test.com' };
      mockAppointmentsService.remove.mockResolvedValue(mockAppointment);

      const result = await controller.remove('1');

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsService.remove).toHaveBeenCalledWith(1);
    });
  });
});