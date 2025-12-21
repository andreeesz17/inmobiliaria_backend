import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointments } from './appointments.entity';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';

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
    });
    return this.appointmentsRepo.save(appointment);
  }

  findAll() {
    return this.appointmentsRepo.find();
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
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

  async remove(id: number) {
    const appointment = await this.findOne(id);
    return this.appointmentsRepo.remove(appointment);
  }
}
