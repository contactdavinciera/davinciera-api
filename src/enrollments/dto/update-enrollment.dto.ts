import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsString()
  readonly paymentStatus?: string;

  @IsOptional()
  @IsNumber()
  readonly paymentAmount?: number;

  @IsOptional()
  @IsDate()
  readonly paymentDate?: Date;

  @IsOptional()
  @IsString()
  readonly affiliateCode?: string;
}

