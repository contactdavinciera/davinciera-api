export class Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructorId: string;
  price: number;
  originalPrice?: number;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  categoryId: string;
  level: string;
  duration: string;
  rating: number;
  studentsEnrolled: number;
  whatYouWillLearn: string[];
  requirements: string[];
  modules: any[];
  lastUpdated: Date;
  language: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
