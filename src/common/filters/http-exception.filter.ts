import {
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  ConflictException,
  GoneException,
  RequestTimeoutException,
  ServiceUnavailableException,
  InternalServerErrorException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto, ErrorType } from '../dto/error-response.dto';
import { LockedException } from '../exceptions/locked.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private isString(value: any): value is string {
    return typeof value === 'string';
  }

  private checkMessage(message: any, searchTerm: string): boolean {
    return this.isString(message) && message.toLowerCase().includes(searchTerm.toLowerCase());
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let errorType: ErrorType = 'system_error';
    let errorCode: string | undefined;
    const message = this.isString(exceptionResponse) 
      ? exceptionResponse 
      : exceptionResponse.message || 'An error occurred';

    // Authentication & Authorization Errors
    if (exception instanceof UnauthorizedException) {
      if (this.checkMessage(message, 'expired')) {
        errorType = 'token_expired_error';
        errorCode = 'TOKEN_EXPIRED';
      } else if (this.checkMessage(message, 'invalid')) {
        errorType = 'invalid_token_error';
        errorCode = 'INVALID_TOKEN';
      } else {
        errorType = 'unauthorized_error';
        errorCode = 'UNAUTHORIZED';
      }
    } else if (exception instanceof ForbiddenException) {
      if (this.checkMessage(message, 'role')) {
        errorType = 'role_required_error';
        errorCode = 'ROLE_REQUIRED';
      } else if (this.checkMessage(message, 'permission')) {
        errorType = 'permission_denied_error';
        errorCode = 'PERMISSION_DENIED';
      } else {
        errorType = 'forbidden_error';
        errorCode = 'FORBIDDEN';
      }
    }
    // Validation & Input Errors
    else if (exception instanceof BadRequestException) {
      if (Array.isArray(exceptionResponse.message)) {
        errorType = 'validation_error';
        errorCode = 'VALIDATION_FAILED';
      } else if (this.checkMessage(message, 'format')) {
        errorType = 'invalid_format_error';
        errorCode = 'INVALID_FORMAT';
      } else if (this.checkMessage(message, 'missing')) {
        errorType = 'missing_field_error';
        errorCode = 'MISSING_FIELD';
      } else {
        errorType = 'invalid_input_error';
        errorCode = 'INVALID_INPUT';
      }
    }
    // Resource & Data Errors
    else if (exception instanceof NotFoundException) {
      errorType = 'not_found_error';
      errorCode = 'RESOURCE_NOT_FOUND';
    } else if (exception instanceof ConflictException) {
      errorType = 'conflict_error';
      errorCode = 'RESOURCE_CONFLICT';
    } else if (exception instanceof LockedException) {
      errorType = 'locked_error';
      errorCode = 'RESOURCE_LOCKED';
    } else if (exception instanceof GoneException) {
      if (this.checkMessage(message, 'expired')) {
        errorType = 'expired_error';
        errorCode = 'RESOURCE_EXPIRED';
      } else {
        errorType = 'deleted_error';
        errorCode = 'RESOURCE_DELETED';
      }
    }
    // System & Technical Errors
    else if (exception instanceof RequestTimeoutException) {
      errorType = 'timeout_error';
      errorCode = 'REQUEST_TIMEOUT';
    } else if (exception instanceof ServiceUnavailableException) {
      errorType = 'service_unavailable';
      errorCode = 'SERVICE_UNAVAILABLE';
    } else if (exception instanceof InternalServerErrorException) {
      if (this.checkMessage(message, 'database')) {
        errorType = 'database_error';
        errorCode = 'DATABASE_ERROR';
      } else if (this.checkMessage(message, 'external')) {
        errorType = 'external_service_error';
        errorCode = 'EXTERNAL_SERVICE_ERROR';
      } else {
        errorType = 'system_error';
        errorCode = 'SYSTEM_ERROR';
      }
    }

    const errorResponse: ErrorResponseDto = {
      code: status,
      type: errorType,
      message,
      errors: Array.isArray(exceptionResponse.message) ? exceptionResponse.message : undefined,
      errorCode,
    };

    response.status(status).json(errorResponse);
  }
} 