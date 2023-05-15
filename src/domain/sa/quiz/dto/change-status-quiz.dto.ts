import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeStatusQuizDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
