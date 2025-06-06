import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  smtpHost: process.env.MAIL_SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.MAIL_SMTP_PORT || '587', 10),
  smtpSecure: process.env.MAIL_SMTP_SECURE === 'true',
  smtpUser: process.env.MAIL_SMTP_USER,
  smtpPass: process.env.MAIL_SMTP_PASS,
  fromEmail: process.env.MAIL_FROM_EMAIL,
  fromName: process.env.MAIL_FROM_NAME || 'AMS System',
})); 