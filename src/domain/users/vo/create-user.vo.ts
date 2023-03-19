import { IsString, Matches, MaxLength, MinLength, validateOrReject } from 'class-validator';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserVo {
  @Expose()
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  login: string;

  @Expose()
  @IsString()
  passwordHash: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Expose()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsString()
  email: string;

  constructor(login: string, password: string, email: string) {
    this.login = login;
    this.email = email;
    this.password = password;
  }

  public async generateHash() {
    this.passwordHash = await bcrypt.hash(this.password, 10);
  }

  public async validate(): Promise<boolean> {
    try {
      await validateOrReject(this);

      return true;
    } catch (e) {
      throw new ConflictException('error for test');
    }
  }
}
