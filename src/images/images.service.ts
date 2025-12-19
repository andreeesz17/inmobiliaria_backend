import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadImageDto } from './dto/upload-image.dto';
import { Image } from './schemas/image.schema';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name)
    private imageModel: Model<Image>,
  ) {}

  async uploadImage(uploadImageDto: UploadImageDto) {
    try {
      const newImage = new this.imageModel({
        ...uploadImageDto,
        upload_date: new Date(),
      });

      const savedImage = await newImage.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Imagen registrada exitosamente',
        data: savedImage,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al registrar la imagen',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCasaId(id_casa: number) {
    try {
      const images = await this.imageModel.find({ id_casa: id_casa }).exec();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Imágenes obtenidas exitosamente',
        data: images,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener las imágenes',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const images = await this.imageModel.find().exec();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Todas las imágenes obtenidas exitosamente',
        data: images,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener las imágenes',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}