import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsString, IsNumber, IsOptional, IsArray, IsJSON } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsArray()
  readonly learningOutcomes?: any[];

  @IsOptional()
  @IsArray()
  readonly requirements?: any[];

  @IsOptional()
  @IsArray()
  readonly tags?: any[];


}

