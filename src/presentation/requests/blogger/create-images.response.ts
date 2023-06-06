import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Exclude()
export class CreateImageItem {
  @Expose()
  url: string;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  fileSize: number;
}

@Exclude()
export class CreateImageResponse {
  @Expose()
  @ValidateNested()
  @Type(() => CreateImageItem)
  main: CreateImageItem[];
}

@Exclude()
export class CreateImagesResponse extends CreateImageResponse {
  @Expose()
  @ValidateNested()
  @Type(() => CreateImageItem)
  wallpaper: CreateImageItem;
}
