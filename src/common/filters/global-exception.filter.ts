import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let type = 'internal_error';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const resObj = res as any;
        message = resObj.message || message;

        // Handle validation error format
        if (Array.isArray(resObj.message)) {
          type = 'validation_error';
          errors = {};

          resObj.message.forEach((msg: string) => {
            const [key, ...rest] = msg.split(' ');
            if (!errors![key]) errors![key] = [];
            errors![key].push(rest.join(' '));
          });
        } else {
          type = resObj.type || type;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      type = 'internal_error';
    }

    response.status(status).json({
      statusCode: status,
      type,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
