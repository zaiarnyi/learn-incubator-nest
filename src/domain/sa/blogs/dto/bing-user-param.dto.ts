import { IsNotEmpty, IsString } from 'class-validator';

export class BingUserParamDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string | number;
}
