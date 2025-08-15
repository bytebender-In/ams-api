import { ApiProperty } from '@nestjs/swagger';

export class DatabaseErrorDto {
  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Error code', required: false, nullable: true })
  code?: string;

  @ApiProperty({ description: 'Error stack trace', required: false, nullable: true })
  stack?: string;
}

export class DatabaseHealthResponseDto {
  @ApiProperty({ description: 'Whether the database connection was successful' })
  success: boolean;

  @ApiProperty({ description: 'Status message' })
  message: string;

  @ApiProperty({ description: 'Database version', required: false, nullable: true })
  version?: string;

  @ApiProperty({
    description: 'Error details if connection failed',
    required: false,
    nullable: true,
    type: DatabaseErrorDto
  })
  error?: DatabaseErrorDto;
} 