import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { CreatePropertiesDto } from './dto/create-properties.dto';
import { UpdatePropertiesDto } from './dto/update-properties.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepo: Repository<Property>,
  ) {}

  async create(dto: CreatePropertiesDto) {
    const property = this.propertiesRepo.create(dto);
    return await this.propertiesRepo.save(property);
  }

  findAll() {
    return this.propertiesRepo.find({ relations: ['features'] });
  }

  async findOne(id: number) {
    const property = await this.propertiesRepo.findOne({ 
      where: { id },
      relations: ['features']
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async update(id: number, dto: UpdatePropertiesDto) {
    const property = await this.findOne(id);
    Object.assign(property, dto);
    return await this.propertiesRepo.save(property);
  }

  async remove(id: number) {
    const property = await this.findOne(id);
    return await this.propertiesRepo.remove(property);
  }
}
