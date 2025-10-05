import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Enrollment, EnrollmentStatus, PaymentStatus } from '@prisma/client';
import { StripeService } from '../stripe/stripe.service';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private coursesService: CoursesService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Check if user is already enrolled in the course
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: createEnrollmentDto.userId,
          courseId: createEnrollmentDto.courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('User is already enrolled in this course.');
    }

    return this.prisma.enrollment.create({
      data: {
        ...createEnrollmentDto,
        status: createEnrollmentDto.status as EnrollmentStatus,
        paymentStatus: createEnrollmentDto.paymentStatus as PaymentStatus,
      },
    });
  }

  async createEnrollmentCheckoutSession(
    userId: string,
    courseId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; enrollmentId: string }> {
    const course = await this.coursesService.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Create a pending enrollment record
    const pendingEnrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: EnrollmentStatus.PENDING, // Mark as pending until payment is confirmed
        paymentStatus: PaymentStatus.PENDING,
        paymentAmount: course.price,
      },
    });

    const session = await this.stripeService.createCheckoutSession(
      course.id,
      course.title,
      course.price,
      successUrl,
      cancelUrl,
      { enrollmentId: pendingEnrollment.id, userId: userId }, // Pass enrollmentId and userId as metadata
    );

    // Update the pending enrollment with the Stripe Checkout Session ID
    await this.prisma.enrollment.update({
      where: { id: pendingEnrollment.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return { sessionId: session.id, enrollmentId: pendingEnrollment.id };
  }

  async findAll(): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    try {
      return await this.prisma.enrollment.update({
        where: { id },
        data: {
          ...updateEnrollmentDto,
          status: updateEnrollmentDto.status as EnrollmentStatus,
          paymentStatus: updateEnrollmentDto.paymentStatus as PaymentStatus,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
  }

  async updateEnrollmentStatusBySessionId(sessionId: string, paymentIntentId: string, status: EnrollmentStatus, paymentStatus: PaymentStatus): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with Stripe Checkout Session ID ${sessionId} not found`);
    }

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status,
        paymentStatus,
        stripePaymentIntentId: paymentIntentId,
        paymentDate: new Date(),
        enrolledAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.enrollment.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
  }
}

