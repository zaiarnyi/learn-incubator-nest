import { Injectable } from '@nestjs/common';
import { UserBannedEntity } from '../../../../../domain/sa/users/entities/user-bans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../domain/users/entities/user.entity';

@Injectable()
export class MainUserBannedRepository {
  constructor(@InjectRepository(UserBannedEntity) private readonly repository: Repository<UserBannedEntity>) {}

  async setUserBan(userBanned: UserBannedEntity) {
    return this.repository.save(userBanned);
  }

  async deleteBan(user: UserEntity) {
    return this.repository.delete({ user });
  }

  async save(body: UserBannedEntity): Promise<UserBannedEntity> {
    return this.repository.save(body);
  }

  async deleteAll() {
    return this.repository.delete({});
  }
}
