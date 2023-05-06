import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../database/repositories/blogs/query-blogs.repository';

@ValidatorConstraint({ name: 'ValidateBlogById', async: true })
@Injectable()
export class ValidateBlogByIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly queryRepository: QueryBlogsRepository) {}

  public async validate(val: any): Promise<boolean> {
    if (isNaN(Number(val))) {
      throw new NotFoundException();
    }
    return this.queryRepository.getBlogById(parseInt(val)).then((res) => {
      if (!res) {
        throw new NotFoundException();
      }
      return true;
    });
  }

  public defaultMessage(): string {
    return `Unauthorized to execute this action`;
  }
}

export function ValidateBlogById(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateBlogByIdValidator,
    });
  };
}
