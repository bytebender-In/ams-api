import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  device?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
