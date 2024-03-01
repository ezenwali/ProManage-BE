import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailAuthListener } from './listeners/email.authentication.listener';
import { IEmailService } from 'src/email/interface';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    EmailAuthListener,
    { provide: IEmailService, useClass: EmailService },
  ],
})
export class EventsModule {}
