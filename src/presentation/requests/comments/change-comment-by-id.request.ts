import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangeCommentByIdRequest {
  @Length(20, 300)
  @IsNotEmpty()
  @IsString()
  content: string;
}
