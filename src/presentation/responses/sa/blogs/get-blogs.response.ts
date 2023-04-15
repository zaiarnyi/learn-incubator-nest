import { CreateBlogResponse } from '../../blogs/create-blog.response';
import { Exclude, Expose } from 'class-transformer';
import { MetaResponse } from '../../meta.response';

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
  blogOwner: BlogOwner;
}

@Exclude()
export class GetBlogsWithOwnerResponse extends MetaResponse {
  @Expose()
  items: GetBlogsWithOwner;
}
