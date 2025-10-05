import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EnrollmentsService {
  private enrollments: Enrollment[] = []; // In-memory storage

  constructor() {
    this.enrollments.push(
      {
        id: 'enr-001',
        userId: 'usr-001',
        courseId: 'crs-001',
        enrollmentDate: new Date('2025-09-10'),
        progress: 75,
        status: 'in-progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'enr-002',
        userId: 'usr-001',
        courseId: 'crs-002',
        enrollmentDate: new Date('2025-08-01'),
        completionDate: new Date('2025-09-20'),
        progress: 100,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }

  create(createEnrollmentDto: CreateEnrollmentDto): Enrollment {
    const newEnrollment: Enrollment = {
      id: uuidv4(),
      ...createEnrollmentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  findAll(): Enrollment[] {
    return this.enrollments;
  }

  findOne(id: string): Enrollment {
    const enrollment = this.enrollments.find(enrollment => enrollment.id === id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Enrollment {
    const enrollmentIndex = this.enrollments.findIndex(enrollment => enrollment.id === id);
    if (enrollmentIndex === -1) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    this.enrollments[enrollmentIndex] = { ...this.enrollments[enrollmentIndex], ...updateEnrollmentDto, updatedAt: new Date() };
    return this.enrollments[enrollmentIndex];
  }

  remove(id: string): void {
    const initialLength = this.enrollments.length;
    this.enrollments = this.enrollments.filter(enrollment => enrollment.id !== id);
    if (this.enrollments.length === initialLength) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
  }
}
