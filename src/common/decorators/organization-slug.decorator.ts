import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const OrganizationSlug = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const slug = request.headers['x-organization-slug'];

    if (!slug) {
      throw new BadRequestException({
        success: false,
        message: 'Organization slug is required',
        error: {
          code: 'MISSING_ORGANIZATION_SLUG',
          details: {
            message: 'X-Organization-Slug header is required',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      });
    }

    return slug;
  },
); 