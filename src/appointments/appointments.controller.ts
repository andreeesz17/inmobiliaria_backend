import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { SuccessResponseDto } from '../common/dto/response.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createAppointmentDto: CreateAppointmentsDto) {
    const appointmentData = {
      ...createAppointmentDto,
      userId: req.user.id,
    };
    
    const appointment = await this.appointmentsService.create(appointmentData);
    return new SuccessResponseDto('Appointment created successfully', appointment);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Request() req) {
    const appointments = await this.appointmentsService.findAll(req.user.role, req.user.id);
    return new SuccessResponseDto('Appointments retrieved successfully', appointments);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    const appointment = await this.appointmentsService.findOne(+id);
    return new SuccessResponseDto('Appointment retrieved successfully', appointment);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentsDto,
    @Request() req,
  ) {
    const appointment = await this.appointmentsService.update(+id, dto);
    return new SuccessResponseDto('Appointment updated successfully', appointment);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AGENT)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
    @Request() req,
  ) {
    const appointment = await this.appointmentsService.updateStatus(+id, dto, req.user.role, req.user.id);
    return new SuccessResponseDto('Appointment status updated successfully', appointment);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.appointmentsService.remove(+id);
    return new SuccessResponseDto('Appointment deleted successfully', result);
  }
}
