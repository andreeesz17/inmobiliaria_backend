import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyFeature } from './property-features.entity';
import { CreatePropertyFeaturesDto } from './dto/create-property-features.dto';
import { UpdatePropertyFeaturesDto } from './dto/update-property-features.dto';

@Injectable()
export class PropertyFeaturesService {
  constructor(
    @InjectRepository(PropertyFeature)
    private readonly featuresRepo: Repository<PropertyFeature>,
  ) {}

  create(dto: CreatePropertyFeaturesDto) {
    const feature = this.featuresRepo.create(dto);
    return this.featuresRepo.save(feature);
  }

  findAll() {
    return this.featuresRepo.find();
  }

  async findOne(id: number) {
    const feature = await this.featuresRepo.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException('Property feature not found');
    }
    return feature;
  }

  async update(id: number, dto: UpdatePropertyFeaturesDto) {
    const feature = await this.findOne(id);
    Object.assign(feature, dto);
    return this.featuresRepo.save(feature);
  }

  async remove(id: number) {
    const feature = await this.findOne(id);
    return this.featuresRepo.remove(feature);
  }
}
