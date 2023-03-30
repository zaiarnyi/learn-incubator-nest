import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { LoginRequest } from '../../../presentation/requests/auth/login.request';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(LocalStrategy.name);
  constructor(@Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const userLogin = new LoginRequest();
    userLogin.loginOrEmail = loginOrEmail;
    userLogin.password = password;
    await userLogin.validate();

    const user = await this.queryUserRepository.getUserByEmailOrLogin(loginOrEmail, loginOrEmail).catch(() => {
      this.logger.error(`Error when getting a user - ${loginOrEmail}`);
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return { userId: user._id.toString() };
  }
}
