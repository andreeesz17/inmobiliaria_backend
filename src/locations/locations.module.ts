import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locations } from './locations.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Locations])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
