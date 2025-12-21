import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { CategoriesModule } from './categories/categories.module';
import { MailModule } from './mail/mail.module';
import { LocationsModule } from './locations/locations.module';
import { ImagesModule } from './images/images.module';
import { RequestsModule } from './requests/requests.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PropertyFeaturesModule } from './property-features/property-features.module';
import { ContractsModule } from './contracts/contracts.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/inmo'),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, 
    }),
    AuthModule, UsersModule, PropertiesModule, CategoriesModule, MailModule, LocationsModule, ImagesModule, RequestsModule, AppointmentsModule, TransactionsModule, PropertyFeaturesModule, ContractsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}