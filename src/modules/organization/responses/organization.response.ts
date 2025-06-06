import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class OrganizationMemberResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  organization_id: string;

  @ApiProperty()
  @Expose()
  user_id: string;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;
}

export class ModuleAccessLimitResponse {
  @ApiProperty()
  @Expose()
  limit_key: string;

  @ApiProperty()
  @Expose()
  limit_value: number;
}

export class ModuleAccessFeatureResponse {
  @ApiProperty()
  @Expose()
  feature_key: string;

  @ApiProperty()
  @Expose()
  feature_value: string;
}

export class ModuleResponse {
  @ApiProperty()
  @Expose()
  muid: string;

  @ApiProperty()
  @Expose()
  module_key: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ModuleAccessResponse {
  @ApiProperty({ type: ModuleResponse })
  @Expose()
  @Type(() => ModuleResponse)
  module: ModuleResponse;

  @ApiProperty({ type: [ModuleAccessLimitResponse] })
  @Expose()
  @Type(() => ModuleAccessLimitResponse)
  limits: ModuleAccessLimitResponse[];

  @ApiProperty({ type: [ModuleAccessFeatureResponse] })
  @Expose()
  @Type(() => ModuleAccessFeatureResponse)
  features: ModuleAccessFeatureResponse[];
}

export class PlanResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: [ModuleAccessResponse] })
  @Expose()
  @Type(() => ModuleAccessResponse)
  module_access: ModuleAccessResponse[];
}

export class SubscriptionResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  suid: string;

  @ApiProperty()
  @Expose()
  user_id: string;

  @ApiProperty()
  @Expose()
  plan_id: number;

  @ApiProperty()
  @Expose()
  start_date: Date;

  @ApiProperty()
  @Expose()
  end_date: Date;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty({ type: PlanResponse })
  @Expose()
  @Type(() => PlanResponse)
  plan: PlanResponse;
}

export class OrganizationResponse {
  @ApiProperty()
  @Expose()
  orguid: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;

  @ApiProperty({ type: [OrganizationMemberResponse] })
  @Expose()
  @Type(() => OrganizationMemberResponse)
  members: OrganizationMemberResponse[];

  @ApiProperty({ type: [SubscriptionResponse] })
  @Expose()
  @Type(() => SubscriptionResponse)
  subscriptions: SubscriptionResponse[];
} 