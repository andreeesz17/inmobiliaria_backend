import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto, TipoOperacion } from './dto/create-request.dto';
import { Property } from './entities/property.entity';
import { Visit } from './schemas/visit.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectModel(Visit.name)
    private visitModel: Model<Visit>,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      const newProperty = this.propertyRepository.create({
        ...createRequestDto,
        createdAt: new Date(),
      });

      const savedProperty = await this.propertyRepository.save(newProperty);

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
      const properties = await this.propertyRepository.find();
      
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
      const property = await this.propertyRepository.findOne({ where: { id } });
      
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
}