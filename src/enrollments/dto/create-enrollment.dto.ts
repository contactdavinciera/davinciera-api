import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly courseId: string;

  @IsDate()
  @IsOptional()
  readonly enrolledAt?: Date;

  @IsDate()
  @IsOptional()
  readonly completedAt?: Date;

  @IsNumber()
  @IsOptional()
  readonly progress?: number; // Percentage

  @IsString()
  @IsOptional()
  readonly status?: string; // e.g., 'ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED'

  @IsString()
  @IsOptional()
  readonly paymentStatus?: string; // e.g., 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'

  @IsNumber()
  @IsOptional()
  readonly paymentAmount?: number;

  @IsDate()
  @IsOptional()
  readonly paymentDate?: Date;

  @IsString()
  @IsOptional()
  readonly affiliateCode?: string;
}

