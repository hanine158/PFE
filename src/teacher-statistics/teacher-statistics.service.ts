import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Injectable()
export class TeacherStatisticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cour)
    private readonly courRepository: Repository<Cour>,
  ) {}

  async getTeacherStatistics(userId: number, period: string) {
    const teacher = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!teacher) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (teacher.role !== UserRole.TEACHER) {
      throw new BadRequestException("Cet utilisateur n'est pas un enseignant");
    }

    const courses = await this.courRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    const totalCourses = courses.length;

    // Adapte selon les colonnes réelles disponibles dans ton entité Cour
    const totalViews = courses.reduce(
      (sum, course: any) => sum + Number(course.views || 0),
      0,
    );

    const totalStudents = courses.reduce(
      (sum, course: any) => sum + Number(course.studentsCount || 0),
      0,
    );

    const avgTimeSpent =
      totalCourses > 0
        ? Math.round(
            courses.reduce(
              (sum, course: any) => sum + Number(course.avgTimeSpent || 0),
              0,
            ) / totalCourses,
          )
        : 0;

    const completionRate =
      totalCourses > 0
        ? Math.round(
            courses.reduce(
              (sum, course: any) => sum + Number(course.completionRate || 0),
              0,
            ) / totalCourses,
          )
        : 0;

    const quizPassRate =
      totalCourses > 0
        ? Math.round(
            courses.reduce(
              (sum, course: any) => sum + Number(course.quizPassRate || 0),
              0,
            ) / totalCourses,
          )
        : 0;

    const stats = {
      totalViews,
      avgTimeSpent,
      completionRate,
      quizPassRate,
      totalCourses,
      totalStudents,
    };

    const courseStats = courses.map((course: any) => ({
      id: course.id,
      name: course.titre || course.title || 'Cours',
      students: Number(course.studentsCount || 0),
      completion: Number(course.completionRate || 0),
      rating: Number(course.rating || 0),
      trend: course.trend || '0%',
    }));

    return {
      period,
      stats,
      courseStats,
    };
  }
}