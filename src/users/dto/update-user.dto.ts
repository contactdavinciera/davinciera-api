import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;
}

