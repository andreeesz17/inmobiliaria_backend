import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointments } from './appointments.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';
import { NotFoundException } from '@nestjs/common';


const mockAppointmentsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repository: Repository<Appointments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointments),
          useValue: mockAppointmentsRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repository = module.get<Repository<Appointments>>(getRepositoryToken(Appointments));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cita exitosamente', async () => {
      const createDto: CreateAppointmentsDto = {
        clientName: 'Juan Pérez',
        email: 'juan@test.com',
        appointmentDate: '2024-12-01T10:00:00Z',
        description: 'Visita a propiedad'
      };

      const mockAppointment = {
        id: 1,
        ...createDto,
        appointmentDate: new Date(createDto.appointmentDate)
      };

      mockAppointmentsRepository.create.mockReturnValue(mockAppointment);
      mockAppointmentsRepository.save.mockResolvedValue(mockAppointment);

      const result = await service.create(createDto);

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsRepository.create).toHaveBeenCalledWith({
        ...createDto,
        appointmentDate: new Date(createDto.appointmentDate)
      });
      expect(mockAppointmentsRepository.save).toHaveBeenCalledWith(mockAppointment);
    });

    it('debería lanzar error cuando falla la creación', async () => {
      const createDto: CreateAppointmentsDto = {
        clientName: 'Juan Pérez',
        email: 'juan@test.com',
        appointmentDate: '2024-12-01T10:00:00Z',
        description: 'Visita a propiedad'
      };

      mockAppointmentsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las citas', async () => {
      const mockAppointments = [
        { id: 1, clientName: 'Cliente 1', email: 'cliente1@test.com' },
        { id: 2, clientName: 'Cliente 2', email: 'cliente2@test.com' }
      ];

      mockAppointmentsRepository.find.mockResolvedValue(mockAppointments);

      const result = await service.findAll();

      expect(result).toEqual(mockAppointments);
      expect(mockAppointmentsRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería encontrar cita por ID', async () => {
      const mockAppointment = { 
        id: 1, 
        clientName: 'Juan Pérez',
        email: 'juan@test.com'
      };

      mockAppointmentsRepository.findOne.mockResolvedValue(mockAppointment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debería lanzar NotFoundException cuando no encuentra la cita', async () => {
      mockAppointmentsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Appointment not found');
    });
  });

  describe('update', () => {
    it('debería actualizar cita exitosamente', async () => {
      const updateDto: UpdateAppointmentsDto = { clientName: 'Nombre actualizado' };
      const existingAppointment = { 
        id: 1, 
        clientName: 'Nombre viejo',
        email: 'email@test.com',
        appointmentDate: new Date(),
        description: 'Descripción'
      } as unknown as Appointments;
      const updatedAppointment = { 
        id: 1, 
        clientName: 'Nombre actualizado',
        email: 'email@test.com',
        appointmentDate: new Date(),
        description: 'Descripción'
      } as unknown as Appointments;

      mockAppointmentsRepository.findOne.mockResolvedValue(existingAppointment);
      mockAppointmentsRepository.save.mockResolvedValue(updatedAppointment);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedAppointment);
      expect(mockAppointmentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockAppointmentsRepository.save).toHaveBeenCalledWith(updatedAppointment);
    });
  });

  describe('remove', () => {
    it('debería eliminar cita exitosamente', async () => {
      const mockAppointment = { 
        id: 1, 
        clientName: 'Cliente a eliminar',
        email: 'email@test.com',
        appointmentDate: new Date(),
        description: 'Descripción'
      } as unknown as Appointments;

      mockAppointmentsRepository.findOne.mockResolvedValue(mockAppointment);
      mockAppointmentsRepository.remove.mockResolvedValue(mockAppointment);

      const result = await service.remove(1);

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockAppointmentsRepository.remove).toHaveBeenCalledWith(mockAppointment);
    });
  });
});