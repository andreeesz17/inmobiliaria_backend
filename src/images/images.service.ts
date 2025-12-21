import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './schemas/image.schema';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}

  async uploadImage(file: Express.Multer.File, id_casa: number) {
    try {
      const newImage = new this.imageModel({
        id_casa,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        estado: 'active',
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
      const images = await this.imageModel.find({ id_casa }).exec();
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
