export class CreateCourseDto {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly instructorId: string;
  readonly price: number;
  readonly originalPrice?: number;
  readonly thumbnailUrl: string;
  readonly previewVideoUrl?: string;
  readonly categoryId: string;
  readonly level: string;
  readonly duration: string;
  readonly rating: number;
  readonly studentsEnrolled: number;
  readonly whatYouWillLearn: string[];
  readonly requirements: string[];
  readonly modules: any[]; // Simplified for now
  readonly language: string;
  readonly tags: string[];
}
