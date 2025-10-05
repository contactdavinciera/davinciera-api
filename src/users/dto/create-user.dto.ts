import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string; // Password is required for creation

  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsOptional()
  @IsString()
  readonly avatarUrl?: string;

  @IsOptional()
  @IsString()
  readonly bio?: string;

  @IsOptional()
  @IsString()
  readonly affiliateCode?: string;

  @IsOptional()
  readonly payoutDetails?: any; // Simplified for mock, would be more detailed
}

