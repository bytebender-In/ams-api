import { Global, Module } from '@nestjs/common';
import { ValidUUIDPipe } from './pipe/valid-uuid.pipe';
// import { PlanLimitGuard } from './guards/plan-limit.guard';

@Global()
@Module({
  providers: [ValidUUIDPipe],
  exports: [ValidUUIDPipe],
})
export class CommonModule {}
