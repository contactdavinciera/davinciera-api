export class Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: Date;
  completionDate?: Date;
  progress: number; // Percentage
  status: string; // e.g., 'in-progress', 'completed', 'dropped'
  createdAt: Date;
  updatedAt: Date;
}
