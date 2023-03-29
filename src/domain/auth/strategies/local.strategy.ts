import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAction } from '../../../application/actions/auth/login.action';
import { plainToClass } from 'class-transformer';
import { LoginRequest } from '../../../presentation/requests/auth/login.request';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(LoginAction) private readonly loginService: LoginAction) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const tokens = await this.loginService.execute(plainToClass(LoginRequest, { password, loginOrEmail }));
    if (!tokens) {
      throw new UnauthorizedException();
    }
    return tokens;
  }
}
