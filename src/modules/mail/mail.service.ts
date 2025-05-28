import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const mailConfig = this.configService.get('mail');
    
    this.transporter = nodemailer.createTransport({
      host: mailConfig.smtpHost,
      port: mailConfig.smtpPort,
      secure: mailConfig.smtpSecure,
      auth: {
        user: mailConfig.smtpUser,
        pass: mailConfig.smtpPass,
      },
    });
  }

  async sendVerification(data: { to: string; code: string; method: string; isSignup?: boolean }): Promise<void> {
    const { to, code, method, isSignup = false } = data;
    const mailConfig = this.configService.get('mail');
    
    let subject: string;
    let html: string;

    if (isSignup) {
      // Welcome email with OTP for new signup
      subject = 'Welcome to AMS! Verify Your Email';
      html = this.getWelcomeTemplate(code);
    } else if (method === 'TOKEN') {
      // Verification token email
      subject = 'Email Verification';
      html = this.getTokenVerificationTemplate(code);
    } else {
      // Regular OTP verification
      subject = 'Verification Code';
      html = this.getOtpVerificationTemplate(code);
    }

    try {
      await this.transporter.sendMail({
        from: `"${mailConfig.fromName}" <${mailConfig.fromEmail}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}:`, error);
      throw error;
    }
  }

  private getWelcomeTemplate(otp: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to AMS!</h1>
        <p style="color: #666; font-size: 16px;">Thank you for signing up. To complete your registration, please use the verification code below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; display: inline-block;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</span>
          </div>
        </div>

        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `;
  }

  private getTokenVerificationTemplate(token: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Email Verification</h1>
        <p style="color: #666; font-size: 16px;">Please use the following token to verify your email:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; display: inline-block;">
            <span style="font-size: 18px; font-weight: bold; word-break: break-all;">${token}</span>
          </div>
        </div>

        <p style="color: #666; font-size: 14px;">This token will expire in 24 hours.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>If you didn't request this verification, you can safely ignore this email.</p>
        </div>
      </div>
    `;
  }

  private getOtpVerificationTemplate(code: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Verification Code</h1>
        <p style="color: #666; font-size: 16px;">Your verification code is:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; display: inline-block;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</span>
          </div>
        </div>

        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      </div>
    `;
  }
} 