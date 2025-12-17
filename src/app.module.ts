import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [PropertiesModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
