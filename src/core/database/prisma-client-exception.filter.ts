import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle specific Prisma error codes
    switch (exception.code) {
      case 'P2000':
        message = 'Input too long for field.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2002':
        message = 'Unique constraint failed.';
        statusCode = HttpStatus.CONFLICT;
        break;
      case 'P2025':
        message = 'Record not found.';
        statusCode = HttpStatus.NOT_FOUND;
        break;
      // Add more cases if needed
      default:
        message = exception.message;
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      errorCode: exception.code,
      meta: exception.meta || null,
    });
  }
}
