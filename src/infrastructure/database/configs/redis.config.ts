import { SharedBullConfigurationFactory } from '@nestjs/bull/dist/interfaces/shared-bull-config.interface';
import { BullRootModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class RedisConfig implements SharedBullConfigurationFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}
  createSharedConfiguration(): Promise<BullRootModuleOptions> | BullRootModuleOptions {
    return {
      url: this.configService.get<string>('REDIS_CONNECT'),
    };
  }
}
