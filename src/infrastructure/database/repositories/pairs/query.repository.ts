import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { Brackets, Repository } from 'typeorm';
import { PairStatusesEnum } from '../../../../domain/pairs/enums/pair-statuses.enum';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { GetMyGamesDto } from '../../../../domain/pairs/dto/get-my-games.dto';
import { PairResultsEntity } from '../../../../domain/pairs/entity/pairResults.entity';
import { GetUsersTopDto, PayloadQueryDto } from '../../../../domain/pairs/dto/get-users-top.dto';
import { GetSortAndDirectionHelper } from '../../../../domain/pairs/helpers/get-sort-and-direction.helper';

@Injectable()
export class QueryPairsRepository {
  constructor(
    @InjectRepository(PairsEntity) readonly repository: Repository<PairsEntity>,
    @InjectRepository(PairResultsEntity) readonly resultRepository: Repository<PairResultsEntity>,
  ) {}

  async getPendingRoom(): Promise<PairsEntity> {
    return this.repository.findOne({
      where: {
        status: PairStatusesEnum.PENDING_SECOND_PLAYER,
      },
      relations: ['firstPlayer'],
    });
  }

  async getActiveGameByUserId(user: UserEntity): Promise<boolean> {
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
      .getExists();
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
      .leftJoinAndSelect('p.questions', 'questions')
      .where('p.id = :id', { id })
      .getOne();
  }

  async getPairsById(id: number): Promise<PairsEntity> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.firstPlayer', 'fp')
      .leftJoinAndSelect('p.secondPlayer', 'sp')
      .where('p.id = :id', { id })
      .getOne();
  }

  async getGamesForUser(user: UserEntity): Promise<PairsEntity[]> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.firstPlayer', 'fp')
      .leftJoinAndSelect('p.secondPlayer', 'sp')
      .where(
        new Brackets((qb) => {
          qb.where('fp.id = :id', { id: user.id }).orWhere('sp.id = :id', { id: user.id });
        }),
      )
      .getMany();
  }

  async getMyGames(payload: GetMyGamesDto, user: UserEntity, offset: number): Promise<[PairsEntity[], number]> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.firstPlayer', 'fp')
      .leftJoinAndSelect('p.secondPlayer', 'sp')
      .leftJoinAndSelect('p.questions', 'questions')
      .where(
        new Brackets((qb) => {
          qb.where('fp.id = :id', { id: user.id }).orWhere('sp.id = :id', { id: user.id });
        }),
      )
      .orderBy(`p."${payload.sortBy}"`, payload.sortDirection)
      .offset(offset)
      .getManyAndCount();
  }

  async getResultAndMany(payload: PayloadQueryDto): Promise<[PairResultsEntity[], number]> {
    const { sort, direction } = GetSortAndDirectionHelper.info(payload.sort[0]);
    const query = this.resultRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .orderBy(`p."${sort}"`, direction);

    if (payload.sort.length > 1) {
      payload.sort.slice(1).forEach((string) => {
        const infoForSort = GetSortAndDirectionHelper.info(string);
        query.addOrderBy(`p."${infoForSort.sort}"`, infoForSort.direction);
      });
    }

    query.limit(payload.limit).offset(payload.offset);
    return query.getManyAndCount();
  }
}
