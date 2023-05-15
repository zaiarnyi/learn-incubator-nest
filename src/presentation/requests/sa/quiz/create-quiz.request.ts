import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateQuizRequest {
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  body: string;

  @IsNotEmpty()
  @IsArray()
  correctAnswers: Array<string | number>;
}
