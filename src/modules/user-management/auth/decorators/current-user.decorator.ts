import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserPayload {
  uuid: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 