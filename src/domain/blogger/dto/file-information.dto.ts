import { IsNumber, IsString } from 'class-validator';

export class FileInformationDto {
  @IsString()
  filename: string;

  @IsNumber()
  size: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
