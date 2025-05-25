import { ParseUUIDPipe, ArgumentMetadata, BadRequestException, Injectable } from "@nestjs/common";

/**
 * A custom pipe that extends ParseUUIDPipe to validate UUID values.
 * This pipe ensures that the provided value is a valid UUID and can be used
 * for database operations and API endpoints.
 * 
 * Features:
 * - Validates UUID format
 * - Provides detailed error messages
 * - Supports version 4 UUIDs
 * - Integrates with NestJS validation pipeline
 * 
 * @example
 * ```typescript
 * @Get(':id')
 * findOne(@Param('id', ValidIdPipe) id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
@Injectable()
export class ValidUUIDPipe extends ParseUUIDPipe {
  constructor() {
    super({
      version: '4',
      errorHttpStatusCode: 400,
    });
  }

  /**
   * Transforms and validates the input value.
   * @param value - The value to validate
   * @param metadata - Additional metadata about the value
   * @returns The validated UUID string
   * @throws BadRequestException if the value is not a valid UUID
   */
  override async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          message: 'Invalid UUID format',
          error: 'Bad Request',
          details: {
            value,
            expectedFormat: 'UUID v4',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        });
      }
      throw error;
    }
  }
}
