import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locations } from './locations.entity';
import { CreateLocationsDto } from './dto/create-locations.dto';
import { UpdateLocationsDto } from './dto/update-locations.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Locations)
    private readonly locationsRepo: Repository<Locations>,
  ) {}

  create(dto: CreateLocationsDto) {
    const location = this.locationsRepo.create(dto);
    return this.locationsRepo.save(location);
  }

  findAll() {
    return this.locationsRepo.find();
  }

  async findOne(id: number) {
    const location = await this.locationsRepo.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(id: number, dto: UpdateLocationsDto) {
    const location = await this.findOne(id);
    Object.assign(location, dto);
    return this.locationsRepo.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    return this.locationsRepo.remove(location);
  }
}
