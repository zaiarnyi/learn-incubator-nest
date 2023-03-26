import { MailerOptionsFactory } from '@nestjs-modules/mailer/dist/interfaces/mailer-options-factory.interface';
import { MailerOptions } from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export class NodemailerConfig implements MailerOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}
  createMailerOptions(): MailerOptions {
    return {
      defaults: {
        from: '"No Reply" <no-reply@zaiarnyi>',
      },
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: this.configService.get<string>('NODEMAILER_EMAIL'),
          pass: this.configService.get<string>('NODEMAILER_PASSWORD'),
        },
      },
      preview: false,
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
