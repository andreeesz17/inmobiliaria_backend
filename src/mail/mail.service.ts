import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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

      return {
        statusCode: HttpStatus.OK,
        message: 'Correo enviado exitosamente',
        data: {
          messageId: info.messageId,
        },
      };
    } catch (error) {
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
}