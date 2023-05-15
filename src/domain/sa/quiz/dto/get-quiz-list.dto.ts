import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PublishedStatusEnum } from '../enums/published-status.enum';
import { Transform } from 'class-transformer';

export class GetQuizListDto {
  @IsString()
  @IsOptional()
  bodySearchTerm: string;

  @IsOptional()
  @IsEnum(PublishedStatusEnum)
  publishedStatus = PublishedStatusEnum.ALL;

  @IsString()
  @IsOptional()
  sortBy = 'createdAt';

  @IsString()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @Transform(({ value }) => value && value.toUpperCase())
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageNumber = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize = 10;
}
