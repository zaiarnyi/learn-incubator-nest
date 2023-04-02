import { IsMongoId, IsString, MaxLength } from 'class-validator';

export class CreatePostRequest {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @MaxLength(1000)
  content: string;

  @IsString()
  @IsMongoId()
  blogId: string;
}
