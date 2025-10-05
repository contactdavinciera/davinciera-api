import { IsString, IsNumber, IsOptional, IsArray, IsJSON } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly subtitle?: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly instructorId: string;

  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsNumber()
  readonly originalPrice?: number;

  @IsString()
  readonly thumbnailUrl: string;

  @IsOptional()
  @IsString()
  readonly previewVideoUrl?: string;

  @IsString()
  readonly categoryId: string;

  @IsString()
  readonly level: string;

  @IsString()
  readonly duration: string;

  @IsNumber()
  @IsOptional()
  readonly rating?: number;

  @IsNumber()
  @IsOptional()
  readonly studentCount?: number;

  @IsArray()
  readonly learningOutcomes: any[]; // Changed to any[] for Prisma Json type

  @IsArray()
  readonly requirements: any[]; // Changed to any[] for Prisma Json type

  @IsArray()
  readonly tags: any[]; // Changed to any[] for Prisma Json type



  @IsString()
  readonly language: string;
}

