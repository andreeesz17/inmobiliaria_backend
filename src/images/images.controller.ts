import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_casa', ParseIntPipe) id_casa: number,
  ) {
    if (!file) {
      throw new BadRequestException('No se envió ninguna imagen');
    }

    return this.imagesService.uploadImage(file, id_casa);
  }

  @Get('casa/:id_casa')
  async findByCasaId(@Param('id_casa', ParseIntPipe) id_casa: number) {
    return this.imagesService.findByCasaId(id_casa);
  }

  @Get()
  async findAll() {
    return this.imagesService.findAll();
  }
}
