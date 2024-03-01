import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { environmentVariables } from 'src/config/env.variables';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: environmentVariables.email.host,
        auth: {
          user: environmentVariables.email.user,
          pass: environmentVariables.email.pass,
        },
      },
      defaults: {
        from: '"Pro-manage" <noreply@pro-manage.com>',
      },
    }),
  ],
  providers: [EmailService],
})
export class EmailMoudle {}
