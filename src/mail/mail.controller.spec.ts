import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { ContractNotificationDto } from './dto/contract-notification.dto';

describe('MailController', () => {
    let controller: MailController;
    let service: MailService;

    
    const mockMailService = {
        sendMail: jest.fn(),
        getMailLogs: jest.fn(),
        sendContractNotification: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MailController],
            providers: [
                {
                    provide: MailService,
                    useValue: mockMailService,
                },
            ],
        }).compile();

        controller = module.get<MailController>(MailController);
        service = module.get<MailService>(MailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('sendMail', () => {
        it('debería enviar correo', async () => {
            const sendMailDto: SendMailDto = {
                to: 'test@example.com',
                subject: 'Test Subject',
                message: '<p>Test Message</p>'
            };

            const mockResult = {
                statusCode: 200,
                message: 'Correo enviado exitosamente',
                data: { messageId: 'message-id-123' }
            };

            mockMailService.sendMail.mockResolvedValue(mockResult);

            const result = await controller.sendMail(sendMailDto);

            expect(result).toEqual(mockResult);
            expect(mockMailService.sendMail).toHaveBeenCalledWith(sendMailDto);
        });
    });

    describe('getMailLogs', () => {
        it('debería obtener logs de correos', async () => {
            const mockLogs = [
                {
                    id: '1',
                    to: 'test1@example.com',
                    subject: 'Subject 1',
                    status: 'sent'
                },
                {
                    id: '2',
                    to: 'test2@example.com',
                    subject: 'Subject 2',
                    status: 'failed'
                }
            ];

            const mockResult = {
                statusCode: 200,
                message: 'Registros de correos obtenidos exitosamente',
                data: mockLogs
            };

            mockMailService.getMailLogs.mockResolvedValue(mockResult);

            const result = await controller.getMailLogs();

            expect(result).toEqual(mockResult);
            expect(mockMailService.getMailLogs).toHaveBeenCalled();
        });
    });

    describe('sendContractNotification', () => {
        it('debería enviar notificación de contrato', async () => {
            const contractNotificationDto: ContractNotificationDto = {
                email: 'client@example.com',
                contractNumber: 'CTR-20240101-1234',
                propertyName: 'Casa en el centro',
                clientName: 'Juan Pérez'
            };

            const mockResult = {
                statusCode: 200,
                message: 'Correo enviado exitosamente',
                data: { messageId: 'message-id-456' }
            };

            mockMailService.sendContractNotification.mockResolvedValue(mockResult);

            const result = await controller.sendContractNotification(contractNotificationDto);

            expect(result).toEqual(mockResult);
            expect(mockMailService.sendContractNotification).toHaveBeenCalledWith(
                'client@example.com',
                'CTR-20240101-1234',
                'Casa en el centro',
                'Juan Pérez'
            );
        });
    });
});