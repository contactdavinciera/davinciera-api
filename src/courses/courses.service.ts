import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CoursesService {
  private courses: Course[] = []; // In-memory storage for demonstration

  constructor() {
    // Populate with some mock data initially
    this.courses.push(
      {
        id: 'crs-001',
        title: 'Mastering Data Modeling from Concept to Implementation',
        subtitle: 'Learn to design robust and scalable data models.',
        description: 'This course covers everything from conceptual to physical data modeling.',
        instructorId: 'usr-002',
        price: 89.99,
        originalPrice: 199.99,
        thumbnailUrl: 'https://img-c.udemycdn.com/course/750x422/175409_d95f_11.jpg',
        previewVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        categoryId: 'cat-tech',
        level: 'Intermediate',
        duration: '15 hours',
        rating: 4.7,
        studentsEnrolled: 12345,
        whatYouWillLearn: ['Design ERDs', 'Normalize databases', 'Implement SQL schemas'],
        requirements: ['Basic understanding of databases'],
        modules: [{ title: 'Introduction', lessons: [{ title: 'What is Data Modeling?' }] }],
        lastUpdated: new Date('2025-09-01'),
        language: 'English',
        tags: ['data modeling', 'database', 'sql'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'crs-002',
        title: 'Advanced Web Development with React and Node.js',
        subtitle: 'Build full-stack applications with modern technologies.',
        description: 'Dive deep into React hooks, Node.js APIs, and database integration.',
        instructorId: 'usr-002',
        price: 129.99,
        originalPrice: 249.99,
        thumbnailUrl: 'https://img-c.udemycdn.com/course/750x422/282180_050e_4.jpg',
        previewVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        categoryId: 'cat-tech',
        level: 'Advanced',
        duration: '25 hours',
        rating: 4.8,
        studentsEnrolled: 8765,
        whatYouWillLearn: ['Develop RESTful APIs', 'Master React', 'Deploy applications'],
        requirements: ['Intermediate JavaScript knowledge'],
        modules: [{ title: 'React Fundamentals', lessons: [{ title: 'Components and Props' }] }],
        lastUpdated: new Date('2025-08-15'),
        language: 'English',
        tags: ['web development', 'react', 'node.js', 'fullstack'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }

  create(createCourseDto: CreateCourseDto): Course {
    const newCourse: Course = {
      id: uuidv4(),
      ...createCourseDto,
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  findAll(): Course[] {
    return this.courses;
  }

  findOne(id: string): Course {
    const course = this.courses.find(course => course.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto): Course {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    this.courses[courseIndex] = { ...this.courses[courseIndex], ...updateCourseDto, updatedAt: new Date() };
    return this.courses[courseIndex];
  }

  remove(id: string): void {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(course => course.id !== id);
    if (this.courses.length === initialLength) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}
