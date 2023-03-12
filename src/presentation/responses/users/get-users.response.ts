import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetUser {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value?.toString())
  id: string;

  @Expose()
  login: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}

@Exclude()
export class GetUsersResponse {
  @Expose()
  pagesCount: number;

  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  totalCount: number;

  @Expose()
  items: GetUser[];
}
