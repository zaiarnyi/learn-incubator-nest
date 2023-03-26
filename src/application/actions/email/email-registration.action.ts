import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailRegistrationAction {
  constructor(private readonly mailerService: MailerService) {}

  public async registration(to: string, code: string) {
    await this.mailerService.sendMail({
      from: `Incubator courses`,
      subject: 'Registration User',
      to,
      template: 'registration',
      context: {
        code,
      },
    });
  }

  public async recoveryPassword(to: string, code: string) {
    const result = await this.mailerService.sendMail({
      from: `Incubator courses`,
      subject: 'Password Recovery',
      to,
      template: 'recovery',
      context: {
        code,
      },
    });
    return result?.messageId;
  }
}
