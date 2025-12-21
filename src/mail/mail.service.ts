import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailLog } from './mail-log.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @InjectRepository(MailLog)
    private mailLogRepository: Repository<MailLog>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_USER'),
        to: sendMailDto.to,
        subject: sendMailDto.subject,
        html: sendMailDto.message,
      });

      
      await this.logMail(sendMailDto.to, sendMailDto.subject, sendMailDto.message, 'sent');

      return {
        statusCode: HttpStatus.OK,
        message: 'Correo enviado exitosamente',
        data: {
          messageId: info.messageId,
        },
      };
    } catch (error) {
    
      await this.logMail(
        sendMailDto.to,
        sendMailDto.subject,
        sendMailDto.message,
        'failed',
        error.message,
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al enviar el correo',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendTransactionConfirmation(email: string, direccion: string, tipo: string) {
    try {
      const htmlContent = `
        <h2>Felicidades</h2>
        <p>Su transacción inmobiliaria de la propiedad ${direccion} ha sido procesada.</p>
        <p>Tipo de operación: ${tipo}</p>
        <p>Fecha: ${new Date().toLocaleDateString()}</p>
      `;

      const mailDto: SendMailDto = {
        to: email,
        subject: `Confirmación de ${tipo} - Propiedad en ${direccion}`,
        message: htmlContent,
      };

      return await this.sendMail(mailDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al enviar la confirmación de transacción',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendContractNotification(
    email: string,
    contractNumber: string,
    propertyName: string,
    clientName: string,
  ) {
    try {
      const htmlContent = `
        <h2>Contrato Generado</h2>
        <p>Estimado ${clientName},</p>
        <p>Le informamos que se ha generado el contrato número ${contractNumber} para la propiedad ${propertyName}.</p>
        <p>Adjunto encontrará los detalles del contrato.</p>
        <p>Fecha: ${new Date().toLocaleDateString()}</p>
      `;

      const mailDto: SendMailDto = {
        to: email,
        subject: `Contrato Generado - ${contractNumber}`,
        message: htmlContent,
      };

      return await this.sendMail(mailDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al enviar la notificación de contrato',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async logMail(
    to: string,
    subject: string,
    content: string,
    status: string,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const mailLog = this.mailLogRepository.create({
        to,
        subject,
        content,
        status,
        errorMessage: errorMessage || null,
      });

      await this.mailLogRepository.save(mailLog);
    } catch (error) {
      
      console.error('Error al registrar el correo:', error);
    }
  }

  async getMailLogs(): Promise<any> {
    try {
      const logs = await this.mailLogRepository.find({
        order: {
          sentAt: 'DESC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Registros de correos obtenidos exitosamente',
        data: logs,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener los registros de correos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}