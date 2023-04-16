import { CreateBlogResponse } from '../../blogs/create-blog.response';
import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../../meta.response';
import { ValidateNested } from 'class-validator';

@Exclude()
class BlogOwner {
  @Expose()
  userId: string;

  @Expose()
  userLogin: string;
}

@Exclude()
class GetBlogsWithOwner extends CreateBlogResponse {
  @Expose()
  @ValidateNested()
  @Type(() => BlogOwner)
  blogOwnerInfo: BlogOwner;
}

@Exclude()
export class GetBlogsWithOwnerResponse extends MetaResponse {
  @Expose()
  @ValidateNested()
  @Type(() => GetBlogsWithOwner)
  items: GetBlogsWithOwner;
}
