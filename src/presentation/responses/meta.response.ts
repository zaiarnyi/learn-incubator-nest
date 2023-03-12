import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MetaResponse {
  @Expose()
  pagesCount: number;

  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  totalCount: number;
}
