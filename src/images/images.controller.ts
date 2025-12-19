import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  async uploadImage(@Body() uploadImageDto: UploadImageDto) {
    return this.imagesService.uploadImage(uploadImageDto);
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