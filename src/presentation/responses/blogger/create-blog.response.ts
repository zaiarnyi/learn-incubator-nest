import { Exclude, Expose, Type } from 'class-transformer';
import { CreateImagesResponse } from '../../requests/blogger/create-images.response';
import { ValidateNested } from 'class-validator';

@Exclude()
export class CreateBlogResponse {
  @Expose()
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

  @Expose()
  @Type(() => CreateImagesResponse)
  @ValidateNested()
  images: CreateImagesResponse;
}
