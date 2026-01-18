import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailLog } from './mail-log.entity';
import { Repository } from 'typeorm';
import { SendMailDto } from './dto/send-mail.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


const mockTransporter = {
    sendMail: jest.fn(),
};

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => mockTransporter),
}));


const mockConfigService = {
    get: jest.fn(),
};


const mockMailLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
};

describe('MailService', () => {
    let service: MailService;
    let configService: ConfigService;
    let mailLogRepository: Repository<MailLog>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: getRepositoryToken(MailLog),
                    useValue: mockMailLogRepository,
                },
            ],
        }).compile();

        service = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
        mailLogRepository = module.get<Repository<MailLog>>(getRepositoryToken(MailLog));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendMail', () => {
        it('debería enviar correo exitosamente', async () => {
            const sendMailDto: SendMailDto = {
                to: 'test@example.com',
                subject: 'Test Subject',
                message: '<p>Test Message</p>'
            };

            const mockInfo = { messageId: 'message-id-123' };

            mockConfigService.get.mockImplementation((key: string) => {
                if (key === 'MAIL_USER') return 'sender@example.com';
                return 'password';
            });

            mockTransporter.sendMail.mockResolvedValue(mockInfo);
            mockMailLogRepository.create.mockReturnValue({} as MailLog);
            mockMailLogRepository.save.mockResolvedValue({} as MailLog);

            const result = await service.sendMail(sendMailDto);

            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Correo enviado exitosamente',
                data: {
                    messageId: 'message-id-123'
                }
            });

            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: 'sender@example.com',
                to: 'test@example.com',
                subject: 'Test Subject',
                html: '<p>Test Message</p>'
            });
            expect(mockMailLogRepository.create).toHaveBeenCalledWith({
                to: 'test@example.com',
                subject: 'Test Subject',
                content: '<p>Test Message</p>',
                status: 'sent',
                errorMessage: null
            });
        });

        it('debería manejar errores al enviar correo', async () => {
            const sendMailDto: SendMailDto = {
                to: 'test@example.com',
                subject: 'Test Subject',
                message: '<p>Test Message</p>'
            };

            const error = new Error('SMTP Error');
            mockTransporter.sendMail.mockRejectedValue(error);
            mockMailLogRepository.create.mockReturnValue({} as MailLog);
            mockMailLogRepository.save.mockResolvedValue({} as MailLog);

            await expect(service.sendMail(sendMailDto)).rejects.toThrow(HttpException);

            expect(mockMailLogRepository.create).toHaveBeenCalledWith({
                to: 'test@example.com',
                subject: 'Test Subject',
                content: '<p>Test Message</p>',
                status: 'failed',
                errorMessage: 'SMTP Error'
            });
        });
    });

    describe('sendTransactionConfirmation', () => {
        it('debería enviar confirmación de transacción', async () => {
            const email = 'client@example.com';
            const direccion = 'Calle Falsa 123';
            const tipo = 'venta';

            const mockResult = {
                statusCode: HttpStatus.OK,
                message: 'Correo enviado exitosamente',
                data: { messageId: 'message-id-456' }
            };


            jest.spyOn(service, 'sendMail').mockResolvedValue(mockResult);

            const result = await service.sendTransactionConfirmation(email, direccion, tipo);

            expect(result).toEqual(mockResult);
            expect(service.sendMail).toHaveBeenCalledWith({
                to: email,
                subject: 'Confirmación de venta - Propiedad en Calle Falsa 123',
                message: expect.stringContaining('Felicidades')
            });
        });

        it('debería manejar errores en confirmación de transacción', async () => {
            const email = 'client@example.com';
            const direccion = 'Calle Falsa 123';
            const tipo = 'venta';

            jest.spyOn(service, 'sendMail').mockRejectedValue(new Error('Send failed'));

            await expect(service.sendTransactionConfirmation(email, direccion, tipo))
                .rejects
                .toThrow(HttpException);
        });
    });

    describe('sendContractNotification', () => {
        it('debería enviar notificación de contrato', async () => {
            const email = 'client@example.com';
            const contractNumber = 'CTR-20240101-1234';
            const propertyName = 'Casa en el centro';
            const clientName = 'Juan Pérez';

            const mockResult = {
                statusCode: HttpStatus.OK,
                message: 'Correo enviado exitosamente',
                data: { messageId: 'message-id-789' }
            };

            jest.spyOn(service, 'sendMail').mockResolvedValue(mockResult);

            const result = await service.sendContractNotification(
                email,
                contractNumber,
                propertyName,
                clientName
            );

            expect(result).toEqual(mockResult);
            expect(service.sendMail).toHaveBeenCalledWith({
                to: email,
                subject: 'Contrato Generado - CTR-20240101-1234',
                message: expect.stringContaining('Contrato Generado')
            });
        });

        it('debería manejar errores en notificación de contrato', async () => {
            const email = 'client@example.com';
            const contractNumber = 'CTR-20240101-1234';
            const propertyName = 'Casa en el centro';
            const clientName = 'Juan Pérez';

            jest.spyOn(service, 'sendMail').mockRejectedValue(new Error('Send failed'));

            await expect(service.sendContractNotification(
                email,
                contractNumber,
                propertyName,
                clientName
            )).rejects.toThrow(HttpException);
        });
    });

    describe('getMailLogs', () => {
        it('debería obtener logs de correos', async () => {
            const mockLogs = [
                {
                    id: '1',
                    to: 'test1@example.com',
                    subject: 'Subject 1',
                    status: 'sent',
                    sentAt: new Date()
                },
                {
                    id: '2',
                    to: 'test2@example.com',
                    subject: 'Subject 2',
                    status: 'failed',
                    sentAt: new Date()
                }
            ];

            mockMailLogRepository.find.mockResolvedValue(mockLogs);

            const result = await service.getMailLogs();

            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Registros de correos obtenidos exitosamente',
                data: mockLogs
            });
            expect(mockMailLogRepository.find).toHaveBeenCalledWith({
                order: { sentAt: 'DESC' }
            });
        });

        it('debería manejar errores al obtener logs', async () => {
            mockMailLogRepository.find.mockRejectedValue(new Error('Database error'));

            await expect(service.getMailLogs()).rejects.toThrow(HttpException);
        });
    });
});