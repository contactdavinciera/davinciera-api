export class CreateEnrollmentDto {
  readonly userId: string;
  readonly courseId: string;
  readonly enrollmentDate: Date;
  readonly completionDate?: Date;
  readonly progress: number; // Percentage
  readonly status: string; // e.g., 'in-progress', 'completed', 'dropped'
}
