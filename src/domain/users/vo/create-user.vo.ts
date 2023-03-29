import { IsBoolean, IsString, Matches, MaxLength, MinLength, validateOrReject } from 'class-validator';
import { BadRequestException, ConflictException } from '@nestjs/common';
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

  @IsBoolean()
  @Expose()
  isConfirm: boolean;

  @Expose()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsString()
  email: string;

  @Expose()
  @IsBoolean()
  isSendEmail: boolean;

  constructor(login: string, password: string, email: string, isConfirm: boolean) {
    this.login = login;
    this.email = email;
    this.password = password;
    this.isConfirm = isConfirm;
    this.isSendEmail = !isConfirm;
  }

  public async generateHash() {
    this.passwordHash = await bcrypt.hash(this.password, 10);
  }

  public async validate(): Promise<boolean> {
    try {
      await validateOrReject(this);
      return true;
    } catch (e) {
      const err = e.map((item) => ({
        field: item.property,
        message: Object.values(item.constraints)[0],
      }));
      throw new BadRequestException(err);
    }
  }
  public getUser() {
    return {
      email: this.email,
      passwordHash: this.passwordHash,
      login: this.login,
      isConfirm: this.isConfirm,
      isSendEmail: this.isSendEmail,
    };
  }
}
