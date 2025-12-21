import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto, TipoTransaccion } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      // Verificar si la casa ya está vendida o alquilada
      const existingTransaction = await this.transactionRepository.findOne({
        where: {
          id_casa: createTransactionDto.id_casa,
          tipo_transaccion: createTransactionDto.tipo_transaccion
        }
      });

      if (existingTransaction) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `La propiedad ya está ${createTransactionDto.tipo_transaccion.toLowerCase()}a`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const newTransaction = this.transactionRepository.create({
        ...createTransactionDto,
        fecha_transaccion: new Date(),
        estado: 'completada',
      });

      const savedTransaction = await this.transactionRepository.save(newTransaction);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transacción registrada exitosamente',
        data: savedTransaction,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al registrar la transacción',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const transactions = await this.transactionRepository.find();
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Transacciones obtenidas exitosamente',
        data: transactions,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener las transacciones',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const transaction = await this.transactionRepository.findOne({ where: { id } });
      
      if (!transaction) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Transacción no encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Transacción obtenida exitosamente',
        data: transaction,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener la transacción',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCliente(id_cliente: number) {
    try {
      const transactions = await this.transactionRepository.find({ 
        where: { id_cliente: id_cliente } 
      });
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Transacciones del cliente obtenidas exitosamente',
        data: transactions,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al obtener las transacciones del cliente',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}