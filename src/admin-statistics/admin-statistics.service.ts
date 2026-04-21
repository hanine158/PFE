import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Injectable()
export class AdminStatisticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cour)
    private readonly coursRepository: Repository<Cour>,
  ) {}

  async getStatistics(period: string) {
    const selectedPeriod = period || 'month';

    const { startDate, labels, bucketStarts } = this.getPeriodConfig(selectedPeriod);

    const [
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalCourses,
      newUsers,
      newCourses,
    ] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.STUDENT } }),
      this.userRepository.count({ where: { role: UserRole.TEACHER } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.coursRepository.count(),
      this.userRepository.find({
        where: { createdAt: Between(startDate, new Date()) },
        select: ['id', 'role', 'createdAt'],
      }),
      this.coursRepository.find({
        where: { createdAt: Between(startDate, new Date()) },
        select: ['id', 'createdAt'],
      }),
    ]);

    const usersPerBucket = new Array(labels.length).fill(0);
    const coursesPerBucket = new Array(labels.length).fill(0);

    for (const user of newUsers) {
      const index = this.findBucketIndex(user.createdAt, bucketStarts);
      if (index !== -1) usersPerBucket[index]++;
    }

    for (const course of newCourses) {
      const index = this.findBucketIndex(course.createdAt, bucketStarts);
      if (index !== -1) coursesPerBucket[index]++;
    }

    const distribution = [
      { label: 'Étudiants', value: totalStudents },
      { label: 'Enseignants', value: totalTeachers },
      { label: 'Admins', value: totalAdmins },
    ];

    const categories = [
      { label: 'Nouveaux utilisateurs', value: newUsers.length },
      { label: 'Cours créés', value: totalCourses },
      { label: 'Étudiants', value: totalStudents },
      { label: 'Enseignants', value: totalTeachers },
    ];

    const completion = [
      {
        label: 'Étudiants / Utilisateurs',
        value:
          totalStudents + totalTeachers + totalAdmins > 0
            ? Math.round(
                (totalStudents / (totalStudents + totalTeachers + totalAdmins)) * 100,
              )
            : 0,
      },
      {
        label: 'Enseignants / Utilisateurs',
        value:
          totalStudents + totalTeachers + totalAdmins > 0
            ? Math.round(
                (totalTeachers / (totalStudents + totalTeachers + totalAdmins)) * 100,
              )
            : 0,
      },
      {
        label: 'Admins / Utilisateurs',
        value:
          totalStudents + totalTeachers + totalAdmins > 0
            ? Math.round(
                (totalAdmins / (totalStudents + totalTeachers + totalAdmins)) * 100,
              )
            : 0,
      },
    ];

    return {
      revenue: {
        labels,
        data: usersPerBucket,
      },
      categories,
      completion,
      distribution,
      coursesEvolution: {
        labels,
        data: coursesPerBucket,
      },
      summary: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalCourses,
        totalUsers: totalStudents + totalTeachers + totalAdmins,
      },
    };
  }

  private getPeriodConfig(period: string) {
    const now = new Date();

    if (period === 'week') {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const labels: string[] = [];
      const bucketStarts: Date[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        bucketStarts.push(new Date(d));
        labels.push(
          d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        );
      }

      return { startDate, labels, bucketStarts };
    }

    if (period === 'year') {
      const startDate = new Date(now.getFullYear(), 0, 1);
      const labels: string[] = [];
      const bucketStarts: Date[] = [];

      for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), i, 1);
        bucketStarts.push(new Date(d));
        labels.push(
          d.toLocaleDateString('fr-FR', { month: 'short' }),
        );
      }

      return { startDate, labels, bucketStarts };
    }

    // month
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const labels = ['S1', 'S2', 'S3', 'S4', 'S5'];
    const bucketStarts: Date[] = [];

    for (let i = 0; i < 5; i++) {
      const d = new Date(startDate);
      d.setDate(1 + i * 7);
      bucketStarts.push(new Date(d));
    }

    return { startDate, labels, bucketStarts };
  }

  private findBucketIndex(dateValue: Date, bucketStarts: Date[]) {
    const date = new Date(dateValue);

    for (let i = bucketStarts.length - 1; i >= 0; i--) {
      if (date >= bucketStarts[i]) {
        return i;
      }
    }

    return -1;
  }
}