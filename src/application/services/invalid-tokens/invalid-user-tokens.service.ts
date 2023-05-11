import { Injectable, Logger } from '@nestjs/common';
import { InvalidTokensEntity } from '../../../domain/auth/entity/invalid-tokens.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class InvalidUserTokensService {
  private logger = new Logger(InvalidUserTokensService.name);
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async checkTokenFromUsers(token: string): Promise<boolean> {
    const t = await this.dataSource.query(`SELECT * FROM user_invalid_tokens WHERE token = $1 LIMIT 1`, [token]);
    return t.length > 0;
  }

  public async saveToken(token: string, userId: number): Promise<InvalidTokensEntity> {
    if (!token || !userId) return null;
    const t = await this.dataSource.query(
      `INSERT INTO user_invalid_tokens ("token", "user") VALUES ($1, $2) RETURNING *`,
      [token, userId],
    );
    return t[0];
  }

  public async removeToken(token: string) {
    await this.dataSource.query(`DELETE FROM user_invalid_tokens WHERE token = $1`, [token]);
  }
}
