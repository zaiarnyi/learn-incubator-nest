import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CreateImageItem {
  @Expose()
  @ApiProperty({ type: String, nullable: false, example: 'https://some url.com' })
  url: string;

  @Expose()
  @ApiProperty({ type: Number, nullable: false, example: 42 })
  width: number;

  @Expose()
  @ApiProperty({ type: Number, nullable: false, example: 42 })
  height: number;

  @Expose()
  @ApiProperty({ type: Number, nullable: false, example: 42 })
  fileSize: number;
}

@Exclude()
export class CreateImageResponse {
  @Expose()
  @ValidateNested()
  @Type(() => CreateImageItem)
  @ApiProperty({ type: CreateImageItem, isArray: true, default: CreateImageItem })
  main: CreateImageItem[] = [];
}

@Exclude()
export class CreateImagesResponse extends CreateImageResponse {
  @Expose()
  @ValidateNested()
  @Type(() => CreateImageItem)
  @ApiProperty({ type: CreateImageItem, nullable: true, default: CreateImageItem })
  wallpaper: CreateImageItem = null;
}
