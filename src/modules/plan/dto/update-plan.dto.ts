import { PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';

/**
 * Data Transfer Object for updating a plan
 * @description Extends CreatePlanDto with all fields optional
 */
export class UpdatePlanDto extends PartialType(CreatePlanDto) {} 