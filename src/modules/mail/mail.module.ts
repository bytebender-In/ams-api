import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import mailConfig from '@/common/config/mail.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {} 