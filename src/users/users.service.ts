import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = []; // In-memory storage for demonstration

  constructor() {
    // Populate with some mock data initially (passwords are hashed versions of 'password123')
    this.users.push(
      { id: 'usr-001', name: 'Alice Smith', email: 'alice@example.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'student', createdAt: new Date(), updatedAt: new Date() },
      { id: 'usr-002', name: 'Bob Johnson', email: 'bob@example.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'instructor', bio: 'Expert in Web Dev', createdAt: new Date(), updatedAt: new Date() },
      { id: 'usr-003', name: 'Charlie Brown', email: 'charlie@example.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'affiliate', affiliateCode: 'CBROWN10', createdAt: new Date(), updatedAt: new Date() },
    );
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto, updatedAt: new Date() };
    return this.users[userIndex];
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  remove(id: string): void {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    if (this.users.length === initialLength) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
