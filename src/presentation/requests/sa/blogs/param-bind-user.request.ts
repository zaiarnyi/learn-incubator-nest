import { IsNotEmpty, IsString } from 'class-validator';

export class ParamBindUserRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
