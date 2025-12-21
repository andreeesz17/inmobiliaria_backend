import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertiesDto } from './dto/create-properties.dto';
import { UpdatePropertiesDto } from './dto/update-properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() dto: CreatePropertiesDto) {
    return this.propertiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertiesDto,
  ) {
    return this.propertiesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }
}
