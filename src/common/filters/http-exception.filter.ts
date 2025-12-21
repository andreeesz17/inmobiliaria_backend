import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      message =
        exceptionResponse.message ||
        exceptionResponse.error ||
        message;

      errors = exceptionResponse.errors || null;
    }

    response.status(status).json(
      new ErrorResponseDto(message, errors),
    );
  }
}
