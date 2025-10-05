import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Course, Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { learningOutcomes, requirements, tags, ...rest } = createCourseDto;
    return this.prisma.course.create({
      data: {
        ...rest,
        learningOutcomes: learningOutcomes as Prisma.JsonArray,
        requirements: requirements as Prisma.JsonArray,
        tags: tags as Prisma.JsonArray,
      },
    });
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
      },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const { learningOutcomes, requirements, tags, ...rest } = updateCourseDto;
    try {
      return await this.prisma.course.update({
        where: { id },
        data: {
          ...rest,
          learningOutcomes: learningOutcomes as Prisma.JsonArray,
          requirements: requirements as Prisma.JsonArray,
          tags: tags as Prisma.JsonArray,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}

