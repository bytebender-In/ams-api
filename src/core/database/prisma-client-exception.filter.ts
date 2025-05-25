import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Log full error details for debugging
    this.logger.error(
      `Prisma error code: ${exception.code}, message: ${exception.message}`,
      exception.stack,
    );

    // Map Prisma error codes to user-friendly messages & HTTP status
    const { statusCode, message } = this.getErrorResponse(exception);

    // Send structured error response
    response.status(statusCode).json({
      statusCode,
      message,
      errorCode: exception.code,
      meta: exception.meta || null,
      ...(process.env.NODE_ENV === 'development' && { fullMessage: exception.message }),
    });
  }

  private getErrorResponse(exception: PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2000':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Input too long for field.' };

      case 'P2001':
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Related record not found.' };

      case 'P2002':
        return { statusCode: HttpStatus.CONFLICT, message: 'Unique constraint failed. Duplicate value exists.' };

      case 'P2003':
        return { statusCode: HttpStatus.CONFLICT, message: 'Foreign key constraint failed. Related record missing or invalid.' };

      case 'P2004':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'A database constraint failed.' };

      case 'P2005':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid value for field.' };

      case 'P2006':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid field name provided.' };

      case 'P2007':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Data validation error.' };

      case 'P2008':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Failed to parse the query.' };

      case 'P2009':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Failed to validate the query.' };

      case 'P2010':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Raw query failed.' };

      case 'P2011':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Null constraint violation.' };

      case 'P2012':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Missing required argument.' };

      case 'P2013':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Missing required field.' };

      case 'P2014':
        return { statusCode: HttpStatus.CONFLICT, message: 'Relation violation occurred.' };

      case 'P2015':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Value out of range.' };

      case 'P2016':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Query interpretation error.' };

      case 'P2017':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Data too long for column.' };

      case 'P2018':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Reserved field name used.' };

      case 'P2019':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Input error on raw query.' };

      case 'P2020':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Value out of range.' };

      case 'P2021':
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Table does not exist in the database.' };

      case 'P2022':
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Column does not exist in the table.' };

      case 'P2023':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Inconsistent column data.' };

      case 'P2024':
        return { statusCode: HttpStatus.CONFLICT, message: 'Referential integrity violation.' };

      case 'P2025':
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Record not found.' };

      case 'P2026':
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Prepared statement could not be executed.' };

      case 'P2027':
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Transaction failed.' };

      case 'P2030':
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to connect to the database.' };

      case 'P2031':
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Database error occurred.' };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: exception.message || 'Internal server error',
        };
    }
  }
}
