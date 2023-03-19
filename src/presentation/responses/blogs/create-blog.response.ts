import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateBlogResponse {
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
