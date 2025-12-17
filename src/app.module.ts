import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { ImagesModule } from './images/images.module';
import { RequestsModule } from './requests/requests.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [MailModule, ImagesModule, RequestsModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
