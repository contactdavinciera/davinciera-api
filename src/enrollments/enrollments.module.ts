import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { StripeModule } from '../stripe/stripe.module';
import { CoursesModule } from '../courses/courses.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, StripeModule, CoursesModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
