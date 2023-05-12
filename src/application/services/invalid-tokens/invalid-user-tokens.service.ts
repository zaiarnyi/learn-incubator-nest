import { Injectable, Logger } from '@nestjs/common';
import { InvalidTokensEntity } from '../../../domain/auth/entity/invalid-tokens.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../domain/users/entities/user.entity';

@Injectable()
export class InvalidUserTokensService {
  private logger = new Logger(InvalidUserTokensService.name);
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(InvalidTokensEntity) private readonly repository: Repository<InvalidTokensEntity>,
  ) {}

  public async checkTokenFromUsers(token: string): Promise<boolean> {
    return !!(await this.repository.findOneBy({ token }));
  }

  public async saveToken(token: string, user: UserEntity): Promise<InvalidTokensEntity> {
    if (!token || !user) return null;
    const invalidToken = new InvalidTokensEntity();
    invalidToken.token = token;
    invalidToken.user = user;
    return this.repository.save(invalidToken);
  }

  public async removeToken(token: string) {
    await this.repository.delete({ token });
  }
}
