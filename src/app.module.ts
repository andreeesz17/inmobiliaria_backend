import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [MailModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
