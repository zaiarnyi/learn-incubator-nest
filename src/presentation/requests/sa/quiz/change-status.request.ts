import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeStatusRequest {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
