import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { ContractNotificationDto } from './dto/contract-notification.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(sendMailDto);
  }

  @Get('logs')
  async getMailLogs() {
    return this.mailService.getMailLogs();
  }

  @Post('contract-notification')
  async sendContractNotification(@Body() contractNotificationDto: ContractNotificationDto) {
    return this.mailService.sendContractNotification(
      contractNotificationDto.email,
      contractNotificationDto.contractNumber,
      contractNotificationDto.propertyName,
      contractNotificationDto.clientName,
    );
  }
}