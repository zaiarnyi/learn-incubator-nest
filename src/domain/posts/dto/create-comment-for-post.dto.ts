import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentForPostDto {
  @Length(20, 300)
  @IsNotEmpty()
  @IsString()
  content: string;
}
