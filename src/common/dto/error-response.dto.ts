import { ApiProperty } from '@nestjs/swagger';

export type ErrorType =
  // Authentication & Authorization
  | 'unauthorized_error'      // 401 - Not authenticated
  | 'forbidden_error'         // 403 - Not authorized
  | 'token_expired_error'     // 401 - JWT expired
  | 'invalid_token_error'     // 401 - Invalid JWT
  | 'role_required_error'     // 403 - Role not found
  | 'permission_denied_error' // 403 - Missing permission

  // Validation & Input
  | 'validation_error'        // 400 - Input validation failed
  | 'invalid_input_error'     // 400 - Invalid input format
  | 'missing_field_error'     // 400 - Required field missing
  | 'duplicate_error'         // 409 - Resource already exists
  | 'invalid_format_error'    // 400 - Invalid data format

  // Resource & Data
  | 'not_found_error'         // 404 - Resource not found
  | 'conflict_error'          // 409 - Resource conflict
  | 'locked_error'            // 423 - Resource locked
  | 'deleted_error'           // 410 - Resource deleted
  | 'expired_error'           // 410 - Resource expired

  // Business Logic
  | 'business_error'          // 400 - Business rule violation
  | 'state_error'             // 400 - Invalid state transition
  | 'limit_exceeded_error'    // 429 - Rate limit exceeded
  | 'quota_exceeded_error'    // 429 - Quota exceeded

  // System & Technical
  | 'system_error'            // 500 - Internal server error
  | 'service_unavailable'     // 503 - Service unavailable
  | 'database_error'          // 500 - Database error
  | 'external_service_error'  // 502 - External service error
  | 'timeout_error';          // 504 - Request timeout

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code'
  })
  code: number;

  @ApiProperty({
    example: 'validation_error',
    description: 'Error type indicating the category of error',
    enum: [
      'unauthorized_error',
      'forbidden_error',
      'token_expired_error',
      'invalid_token_error',
      'role_required_error',
      'permission_denied_error',
      'validation_error',
      'invalid_input_error',
      'missing_field_error',
      'duplicate_error',
      'invalid_format_error',
      'not_found_error',
      'conflict_error',
      'locked_error',
      'deleted_error',
      'expired_error',
      'business_error',
      'state_error',
      'limit_exceeded_error',
      'quota_exceeded_error',
      'system_error',
      'service_unavailable',
      'database_error',
      'external_service_error',
      'timeout_error'
    ]
  })
  type: ErrorType;

  @ApiProperty({
    example: 'Invalid input data',
    description: 'Error message'
  })
  message: string;

  @ApiProperty({
    example: ['password must be at least 8 characters'],
    description: 'Validation errors if any',
    required: false
  })
  errors?: string[];

  @ApiProperty({
    example: 'USER_CREATION_FAILED',
    description: 'Error code for frontend handling',
    required: false
  })
  errorCode?: string;
} 