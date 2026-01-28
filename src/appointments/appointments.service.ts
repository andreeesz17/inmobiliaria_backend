import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointments } from './appointments.entity';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private readonly appointmentsRepo: Repository<Appointments>,
  ) {}

  create(dto: CreateAppointmentsDto) {
    const appointment = this.appointmentsRepo.create({
      ...dto,
      appointmentDate: new Date(dto.appointmentDate),
      status: AppointmentStatus.PENDING,
    });
    return this.appointmentsRepo.save(appointment);
  }

  async findAll(role?: Role, userId?: number) {
    const queryBuilder = this.appointmentsRepo.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.agent', 'agent');

    if (role === Role.USER) {
      queryBuilder.where('appointment.userId = :userId', { userId });
    } else if (role === Role.AGENT) {
      queryBuilder.where('appointment.agentId = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: ['user', 'agent'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentsDto) {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return this.appointmentsRepo.save(appointment);
  }

  async updateStatus(id: number, dto: UpdateAppointmentStatusDto, userRole: Role, userId: number) {
    const appointment = await this.findOne(id);
    
    if (userRole === Role.USER && appointment.userId !== userId) {
      throw new ForbiddenException('Cannot update status of appointments from other users');
    }
    
    if (userRole === Role.AGENT && appointment.agentId !== userId) {
      throw new ForbiddenException('Cannot update status of appointments from other agents');
    }

    appointment.status = dto.status;
    return this.appointmentsRepo.save(appointment);
  }

  async remove(id: number) {
    const appointment = await this.findOne(id);
    return this.appointmentsRepo.remove(appointment);
  }
}
