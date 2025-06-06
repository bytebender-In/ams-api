import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorDetailsResponse {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  error: string;

  @ApiProperty()
  @Expose()
  statusCode: number;
}

export class ErrorResponse {
  @ApiProperty()
  @Expose()
  success: boolean;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty({ type: ErrorDetailsResponse })
  @Expose()
  error: {
    code: string;
    details: ErrorDetailsResponse;
  };
} 