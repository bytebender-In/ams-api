import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const ModuleAccess = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const moduleKey = request.headers['x-module-key'];

    if (!moduleKey) {
      throw new ForbiddenException({
        success: false,
        message: 'Module key is required',
        error: {
          code: 'MISSING_MODULE_KEY',
          details: {
            message: 'X-Module-Key header is required',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    const user = request.user;
    if (!user || !user.module_access) {
      throw new ForbiddenException({
        success: false,
        message: 'Module access not found',
        error: {
          code: 'FORBIDDEN',
          details: {
            message: 'User does not have access to this module',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    const moduleAccess = user.module_access.find(
      access => access.module_key === moduleKey
    );

    if (!moduleAccess) {
      throw new ForbiddenException({
        success: false,
        message: 'Module access not found',
        error: {
          code: 'FORBIDDEN',
          details: {
            message: 'User does not have access to this module',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    return moduleAccess;
  },
); 