import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Cour)
    private courseRepo: Repository<Cour>,
  ) {}

  async getDashboard() {
    const users = await this.userRepo.find();
    const courses = await this.courseRepo.find();

    const teachers = users.filter(u => u.role === 'teacher').length;
    const students = users.filter(u => u.role === 'student').length;

    return {
      name: 'Admin',
      role: 'Administrateur',
      totalTeachers: teachers,
      totalCourses: courses.length,
      totalStudents: students,
      totalRevenue: courses.reduce((sum, c) => sum + (c.price || 0), 0),

      topTeachers: users
        .filter(u => u.role === 'teacher')
        .slice(0, 4)
        .map((t, i) => ({
          id: t.id,
          name: t.name,
          courses: Math.floor(Math.random() * 10),
          students: Math.floor(Math.random() * 300),
          rating: (4 + Math.random()).toFixed(1),
        })),

      recentActivities: [
        {
          id: 1,
          title: 'Nouvel utilisateur',
          message: 'Un étudiant vient de s’inscrire',
          time: 'Il y a 2h',
          icon: '👤',
        },
        {
          id: 2,
          title: 'Nouveau cours',
          message: 'Un cours a été ajouté',
          time: 'Il y a 5h',
          icon: '📚',
        },
      ],
    };
  }
}