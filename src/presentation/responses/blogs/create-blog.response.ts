import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CreateBlogResponse {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value?.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  websiteUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  isMembership: boolean;
}
