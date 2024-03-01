import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IEmailService } from 'src/email/interface';
import {
  OTPEvent,
  newRegisteredUserEvent,
} from '../events/email.authentication';
import { emailEventKey } from '../key';

@Injectable()
export class EmailAuthListener {
  constructor(private _emailService: IEmailService) {}

  @OnEvent(emailEventKey.sendOTP)
  async handleOTPListner(event: OTPEvent) {
    await this._emailService.sendUserOtp({
      email: event.email,
      code: String(event.code),
    });
  }

  @OnEvent(emailEventKey.welcome)
  async newUserRegisteredListner(event: newRegisteredUserEvent) {
    this._emailService.sendWelcomeEmail({
      email: event.email,
    });
  }
}
