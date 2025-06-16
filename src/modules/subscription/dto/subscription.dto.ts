import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the plan to subscribe to',
    example: 'pla_123456789'
  })
  @IsString()
  plan_id: string;
}

export class SubscriptionResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the subscription',
    example: 'sub_123456789'
  })
  suid: string;

  @ApiProperty({
    description: 'ID of the user who owns this subscription',
    example: 'usr_123456789'
  })
  user_id: string;

  @ApiProperty({
    description: 'ID of the plan',
    example: 'pla_123456789'
  })
  plan_id: string;

  @ApiProperty({
    description: 'Start date of the subscription',
    example: '2024-02-20T10:00:00Z'
  })
  start_date: Date;

  @ApiProperty({
    description: 'End date of the subscription',
    example: '2024-03-20T10:00:00Z'
  })
  end_date: Date;

  @ApiProperty({
    description: 'Status of the subscription',
    example: 'active',
    enum: ['active', 'inactive', 'cancelled', 'expired']
  })
  status: string;

  @ApiProperty({
    description: 'Region of the subscription',
    example: 'global',
    nullable: true
  })
  region?: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-02-20T10:00:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-02-20T10:00:00Z'
  })
  updated_at: Date;

  @ApiProperty({
    description: 'The plan details',
    type: 'object',
    additionalProperties: true
  })
  plan: any;

  @ApiProperty({
    description: 'Subscription limits',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        limit_type: { type: 'string' },
        limit_value: { type: 'number' },
        region: { type: 'string', nullable: true }
      }
    }
  })
  subscription_limits: {
    id: number;
    limit_type: string;
    limit_value: number;
    region?: string | null;
  }[];

  @ApiProperty({
    description: 'Module access information',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        module: {
          type: 'object',
          properties: {
            mouid: { type: 'string' },
            name: { type: 'string' },
            module_key: { type: 'string' },
            is_active: { type: 'boolean' }
          }
        },
        is_active: { type: 'boolean' },
        module_limits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              limit_key: { type: 'string' },
              limit_value: { type: 'number' }
            }
          }
        },
        module_features: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              feature_key: { type: 'string' },
              feature_value: { type: 'string' }
            }
          }
        }
      }
    }
  })
  accesses: {
    module: {
      mouid: string;
      name: string;
      module_key: string;
      is_active: boolean;
    };
    is_active: boolean;
    module_limits: {
      limit_key: string;
      limit_value: number;
    }[];
    module_features: {
      feature_key: string;
      feature_value: string;
    }[];
  }[];
} 