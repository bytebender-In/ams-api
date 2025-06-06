import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus, Plan } from '@prisma/client';
import { PlanResponseDto } from './plan-response.dto';

export class SubscriptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  suid: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  plan_id: number;

  @ApiProperty({ required: false, nullable: true })
  organization_id: string | null;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: () => PlanResponseDto, required: false })
  plan?: Plan;
} 