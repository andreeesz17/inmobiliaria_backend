import { Injectable, HttpStatus, HttpException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto, TipoOperacion } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Property } from './schemas/property.schema';
import { Visit } from './schemas/visit.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<Property>,
    @InjectModel(Visit.name)
    private visitModel: Model<Visit>,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      const newProperty = new this.propertyModel({
        ...createRequestDto,
        createdAt: new Date(),
        status: 'pending'
      });

      const savedProperty = await newProperty.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Solicitud registrada exitosamente',
        data: savedProperty,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al registrar la solicitud',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const properties = await this.propertyModel.find();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Solicitudes obtenidas exitosamente',
        data: properties,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener las solicitudes',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const property = await this.propertyModel.findById(id);
      
      if (!property) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Solicitud no encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Solicitud obtenida exitosamente',
        data: property,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener la solicitud',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto, userId: string, userRole: Role) {
    if (userRole !== Role.ADMIN && userRole !== Role.AGENT) {
      throw new ForbiddenException('Only admins and agents can update request status');
    }

    try {
      const property = await this.propertyModel.findById(id);
      
      if (!property) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Solicitud no encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      property.status = updateStatusDto.status;
      property.updatedBy = userId;
      property.updatedAt = new Date();

      const updatedProperty = await property.save();

      return {
        statusCode: HttpStatus.OK,
        message: 'Estado actualizado exitosamente',
        data: {
          _id: updatedProperty._id,
          status: updatedProperty.status,
          updatedBy: updatedProperty.updatedBy,
          updatedAt: updatedProperty.updatedAt,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al actualizar el estado',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
