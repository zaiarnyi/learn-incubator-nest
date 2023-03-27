import { Module } from '@nestjs/common';
import { EmailRegistrationService } from '../../application/services/email/email-registration.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailerConfig } from '../email/config/nodemailer.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: NodemailerConfig,
    }),
  ],
  providers: [EmailRegistrationService],
  exports: [EmailRegistrationService],
})
export class EmailModule {}
