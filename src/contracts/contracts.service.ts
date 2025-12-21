import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { Contract } from './contract.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    private readonly mailService: MailService,
  ) {}

  async create(createContractDto: CreateContractDto) {
    try {
      // Generar número de contrato único
      const contractNumber = this.generateContractNumber();
      
      // Generar hash digital
      const digitalHash = this.generateDigitalHash();
      
      // Términos por defecto si no se proporcionan
      const terms = createContractDto.terms || this.getDefaultTerms();
      
      // Crear contrato en PostgreSQL
      const newContract = this.contractRepository.create({
        contractNumber,
        transactionId: createContractDto.transactionId,
        totalAmount: 0, 
        duration: createContractDto.endDate ? this.calculateDuration(createContractDto.startDate, createContractDto.endDate) : null,
        terms,
        startDate: createContractDto.startDate,
        endDate: createContractDto.endDate,
        digitalHash,
        status: 'active',
        createdAt: new Date(),
      });

      // Forzamos que savedContract sea un objeto único de tipo Contract
      const savedContract: Contract = await this.contractRepository.save(newContract);

      // Enviar contrato por email
      await this.sendContractByEmail(savedContract);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Contrato creado exitosamente',
        data: savedContract,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al crear el contrato',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const contracts = await this.contractRepository.find();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Contratos obtenidos exitosamente',
        data: contracts,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener los contratos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const contract = await this.contractRepository.findOne({ where: { id } });
      
      if (!contract) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Contrato no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Contrato obtenido exitosamente',
        data: contract,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener el contrato',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(userId: string) {
    try {
      // Buscar en PostgreSQL usando el repositorio
      const contracts = await this.contractRepository.find({
        where: { transactionId: userId } 
      });
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Contratos del usuario obtenidos exitosamente',
        data: contracts,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener los contratos del usuario',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateContractNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CTR-${year}${month}${day}-${random}`;
  }

  private generateDigitalHash(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private getDefaultTerms(): string {
    return "Términos y condiciones estándar del contrato. Este documento establece el acuerdo legal entre las partes involucradas.";
  }

  private calculateDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Meses
  }

  private async sendContractByEmail(contract: Contract) {
    try {
      // Enviar email con el contrato
      await this.mailService.sendMail({
        to: 'cliente@example.com', // Este debería obtenerse del cliente
        subject: `Contrato ${contract.contractNumber}`,
        message: `Se ha generado el contrato con número ${contract.contractNumber}. Términos: ${contract.terms}`,
      });
    } catch (error) {
      // No lanzamos excepción aquí para no interrumpir el flujo principal
      console.error('Error al enviar el contrato por email:', error);
    }
  }
}