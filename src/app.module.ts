import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppointmentsModule } from './appointments/appointments.module';
import { LocationsModule } from './locations/locations.module';
import { PropertiesModule } from './properties/properties.module';
import { PropertyFeaturesModule } from './property-features/property-features.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),


    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      synchronize: true, 
    }),

    AppointmentsModule,
    LocationsModule,
    PropertiesModule,
    PropertyFeaturesModule,
  ],
})
export class AppModule {}
