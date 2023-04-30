import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class PostgresqlConfigDatabase implements TypeOrmOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    if (!isDev) {
      return {
        type: 'postgres',
        url: this.configService.get<string>('POSTGRES_CLOUD_URL'),
        retryAttempts: 3,
      };
    }
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: +this.configService.get<number>('POSTGRES_PORT'),
      username: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DATABASE'),
      retryAttempts: 3,
    };
  }
}
