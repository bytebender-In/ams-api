import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { map, Observable, tap } from 'rxjs';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ResponseInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const { method, url } = req;
  
      this.logger.debug({
        message: 'Incoming HTTP request',
        method,
        path: url,
        timestamp: new Date().toISOString(),
      });
  
      const res = context.switchToHttp().getResponse();
  
      return next.handle().pipe(
        map((data) => {
          const message = data?.message || 'Success';
          
          if (data?.message) {
            const { message: _, ...restData } = data;
            return {
              statusCode: res.statusCode,
              message,
              data: restData,
            };
          }
  
          return {
            statusCode: res.statusCode,
            message,
            data,
          };
        }),
        tap(() => {
          this.logger.debug({
            message: 'Outgoing HTTP response',
            method,
            path: url,
            statusCode: res.statusCode,
            timestamp: new Date().toISOString(),
          });
        }),
      );
    }
  }
  