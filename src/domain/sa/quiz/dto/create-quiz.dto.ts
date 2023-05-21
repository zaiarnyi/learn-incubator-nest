import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  body: string;

  @IsNotEmpty()
  @IsArray()
  correctAnswers: string[];
}
