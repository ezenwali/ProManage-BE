import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmailMoudle } from './email/email.module';
import { EventsModule } from './events/events.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ProjectModule, EventsModule, EmailMoudle, UserModule],
})
export class AppModule {}
