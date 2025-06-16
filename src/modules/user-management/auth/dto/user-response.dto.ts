import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for returning user information in API responses.
 * 
 * This DTO encapsulates essential user details while omitting sensitive data such as passwords.
 * It is designed for secure and consistent data exposure in an enterprise-level system.
 * 
 * Fields include personal identifiers, contact verification statuses, locale settings,
 * account status, and security-related metadata such as login attempts and timestamps.
 * 
 * The structure supports nullable fields to handle optional user information gracefully,
 * and is fully annotated for Swagger API documentation integration.
 * 
 * @author Vartik Anand
 */

export class ModuleAccessDto {
  @ApiProperty({ description: 'Module key' })
  module_key: string;

  @ApiProperty({ description: 'Module name' })
  name: string;

  @ApiProperty({ description: 'Module limits' })
  limits: {
    limit_key: string;
    limit_value: number;
  }[];

  @ApiProperty({ description: 'Module features' })
  features: {
    feature_key: string;
    feature_value: string;
  }[];
}

export class UserResponseDto {
  @ApiProperty({ description: 'User unique identifier (UUID)' })
  uuid: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiPropertyOptional({ description: 'User phone number', nullable: true })
  phone_number?: string | null;

  @ApiPropertyOptional({ description: 'Username', nullable: true })
  username?: string | null;

  @ApiProperty({ description: 'First name of the user' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user' })
  last_name: string;

  @ApiProperty({ description: 'Preferred language' })
  language: string;

  @ApiProperty({ description: 'Timezone of the user' })
  timezone: string;

  @ApiProperty({ description: 'Current status of the user account' })
  status: string;

  @ApiPropertyOptional({ description: 'Indicates if the user\'s email has been verified' })
  email_verified?: boolean;

  @ApiPropertyOptional({ description: 'Indicates if the user\'s phone number has been verified' })
  phone_verified?: boolean;

  @ApiPropertyOptional({ description: 'Timestamp of the user\'s last successful login', type: String, format: 'date-time', nullable: true })
  last_login_at?: Date | null;

  @ApiPropertyOptional({ description: 'Number of consecutive failed login attempts' })
  failed_login_attempts?: number;

  @ApiPropertyOptional({ description: 'Timestamp of the last failed login attempt', type: String, format: 'date-time', nullable: true })
  last_failed_login_at?: Date | null;

  @ApiPropertyOptional({ description: 'User\'s module access', type: [ModuleAccessDto] })
  module_access?: ModuleAccessDto[];
}
