import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(QueryUserBannedRepository) private readonly userBannedRepository: QueryUserBannedRepository,
    @Inject(UserQueryRepository) private readonly userQueryRepository: UserQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    const user = await this.userQueryRepository.getUserById(payload.id);

    if (!user || user.isBanned) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
