import { Inject } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigService } from '@nestjs/config';

export class JwtConfigService implements JwtOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}
  createJwtOptions(): JwtModuleOptions {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expires_access = this.configService.get<string>('ACCESS_TOKEN_EXPIRE_TIME');
    return {
      secret: secret,
      signOptions: { expiresIn: expires_access },
    };
  }
}
