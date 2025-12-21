import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PropertyFeaturesService } from './property-features.service';
import { CreatePropertyFeaturesDto } from './dto/create-property-features.dto';
import { UpdatePropertyFeaturesDto } from './dto/update-property-features.dto';

@Controller('property-features')
export class PropertyFeaturesController {
  constructor(
    private readonly propertyFeaturesService: PropertyFeaturesService,
  ) {}

  @Post()
  create(@Body() dto: CreatePropertyFeaturesDto) {
    return this.propertyFeaturesService.create(dto);
  }

  @Get()
  findAll() {
    return this.propertyFeaturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyFeaturesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyFeaturesDto,
  ) {
    return this.propertyFeaturesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyFeaturesService.remove(+id);
  }
}
