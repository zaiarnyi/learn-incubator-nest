import { Module } from '@nestjs/common';
import { EmailRegistrationAction } from '../../application/actions/email/email-registration.action';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailerConfig } from '../email/config/nodemailer.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: NodemailerConfig,
    }),
  ],
  providers: [EmailRegistrationAction],
  exports: [EmailRegistrationAction],
})
export class EmailModule {}
