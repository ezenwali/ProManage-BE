import { Injectable } from '@nestjs/common';
import { IEmailService, IsendUserOtp, IwelcomeMail } from './interface';
import { MailerService } from '@nestjs-modules/mailer';
import { sendOtpMessage, sendWelcomeEmailMessage } from './email.template';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendWelcomeEmail({ email }: IwelcomeMail) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Pro-Manage',
      text: 'welcome',
      html: sendWelcomeEmailMessage(),
    });
  }

  async sendUserOtp({ email, code }: IsendUserOtp): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification OTP',
      text: 'welcome',
      html: sendOtpMessage(code),
    });
  }
}
