import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Property } from './entities/property.entity';
import { Visit, VisitSchema } from './schemas/visit.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
    MongooseModule.forFeature([
      { name: Visit.name, schema: VisitSchema },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService]
})
export class RequestsModule {}