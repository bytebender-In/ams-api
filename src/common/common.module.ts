import { Global, Module } from '@nestjs/common';
import { ValidUUIDPipe } from './pipe/valid-uuid.pipe';

@Global()
@Module({
  providers: [ValidUUIDPipe],
  exports: [ValidUUIDPipe],
})
export class CommonModule {}
