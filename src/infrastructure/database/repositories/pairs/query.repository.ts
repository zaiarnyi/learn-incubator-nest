import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { Brackets, Repository } from 'typeorm';
import { PairStatusesEnum } from '../../../../domain/pairs/enums/pair-statuses.enum';
import { UserEntity } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class QueryPairsRepository {
  constructor(@InjectRepository(PairsEntity) readonly repository: Repository<PairsEntity>) {}

  async getPendingRoom(): Promise<PairsEntity> {
    return this.repository.findOne({
      where: {
        status: PairStatusesEnum.PENDING_SECOND_PLAYER,
      },
      relations: ['firstPlayer', 'secondPlayer'],
    });
  }

  async getActiveGameByUserId(user: UserEntity): Promise<PairsEntity> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoin('p.firstPlayer', 'fp')
      .leftJoin('p.secondPlayer', 'sp')
      .where('p.status = :status', { status: PairStatusesEnum.ACTIVE })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fp.id = :id', { id: user.id }).orWhere('sp.id = :id', { id: user.id });
        }),
      )
      .getOne();
  }

  async getUserUnfinishedGame(user: UserEntity): Promise<PairsEntity> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.firstPlayer', 'fp')
      .leftJoinAndSelect('p.secondPlayer', 'sp')
      .leftJoinAndSelect('p.questions', 'questions')
      .where('p.status <> :status', { status: PairStatusesEnum.FINISH })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fp.id = :id', { id: user.id }).orWhere('sp.id = :id', { id: user.id });
        }),
      )
      .getOne();
  }

  async getUserActiveGame(user: UserEntity): Promise<PairsEntity> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.firstPlayer', 'fp')
      .leftJoinAndSelect('p.secondPlayer', 'sp')
      .leftJoinAndSelect('p.questions', 'questions')
      .where('p.status = :status', { status: PairStatusesEnum.ACTIVE })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fp.id = :id', { id: user.id }).orWhere('sp.id = :id', { id: user.id });
        }),
      )
      .getOne();
  }

  async getPairById(id: number): Promise<PairsEntity> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.firstPlayer', 'fp')
      .leftJoinAndSelect('p.secondPlayer', 'sp')
      .leftJoinAndSelect('p."questions', 'questions')
      .where('p.id = :id', { id })
      .getOne();
  }

  async getPairByIdWithOutRelations(id: number): Promise<PairsEntity> {
    return this.repository.findOneBy({ id });
  }
}
