import { Injectable } from '@nestjs/common';
import { addMinutes } from '../../../../utils/date';
import { ActivateEmailsCodeEntity } from '../../../../domain/auth/entity/activate-code.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class MainActivateCodeRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(ActivateEmailsCodeEntity) private readonly repository: Repository<ActivateEmailsCodeEntity>,
  ) {}

  async saveRegActivation(code: string, user: UserEntity, type: string) {
    const find = await this.repository.findOne({ where: { user, type } });
    const expireAt = addMinutes(new Date(), 60);
    if (find) {
      return this.repository.update({ user, type }, { code, expireAt });
    }
    return this.repository.insert({ code, expireAt, user, type });
  }

  async getUserIdByCode(code: string, type: string): Promise<number> {
    const find = await this.repository.findOne({
      where: { code, type },
      relations: ['users'],
    });
    return find?.user?.id ?? null;
  }

  async getItemByCode(code: string, type: string): Promise<ActivateEmailsCodeEntity> {
    return this.repository.findOne({ where: { code, type } });
  }

  async deleteByCode(code: string, type: string) {
    return this.repository.delete({ code, type });
  }

  async deleteByUserId(user: UserEntity, type) {
    return this.repository.delete({ user, type });
  }
}
