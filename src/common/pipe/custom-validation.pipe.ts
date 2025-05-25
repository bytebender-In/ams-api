import {
    ValidationPipe,
    BadRequestException,
    ValidationError,
  } from '@nestjs/common';
  
  export class CustomValidationPipe extends ValidationPipe {
    constructor() {
      super({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => {
          const formattedErrors: Record<string, string> = {};
          for (const error of errors) {
            const key = error.property;
            const constraints = Object.values(error.constraints || {});
            formattedErrors[key] = constraints.join(', ');
          }
  
          return new BadRequestException({
            type: 'validation_error',
            message: formattedErrors,
          });
        },
      });
    }
  }
  