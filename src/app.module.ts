import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { UserModule } from './user/user.module';
import { BadgeModule } from './badge/badge.module';
import { CoursModule } from './cours/cours.module';
import { ProgressModule } from './progress/progress.module';
import { PdfdocModule } from './pdfdoc/pdfdoc.module';
import { SchemaModule } from './schema/schema.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { AnalyseResModule } from './analyse-res/analyse-res.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TeacherStatisticsModule } from './teacher-statistics/teacher-statistics.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { TeacherNotificationsModule } from './teacher-notifications/teacher-notifications.module';
import { AdminStatisticsModule } from './admin-statistics/admin-statistics.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { AdminNotificationsModule } from './admin-notifications/admin-notifications.module';
import { ChatModule } from './chat/chat.module';
import { AiQuizModule } from './ai-quiz/ai-quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT') || 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'hanine'),
        database: configService.get<string>('DB_NAME', 'db1'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET', 'secretKey'),
        signOptions: { expiresIn: '7d' },
      }),
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: Number(configService.get<string>('MAIL_PORT') || 587),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>(
            'MAIL_FROM',
            '"LearnX" <no-reply@learnx.com>',
          ),
        },
      }),
    }),

    UserModule,
    BadgeModule,
    CoursModule,
    ProgressModule,
    PdfdocModule,
    SchemaModule,
    QuizModule,
    QuestionModule,
    AnalyseResModule,
    AuthModule,
    NotificationModule,
    StatisticsModule,
    TeacherStatisticsModule,
    LeaderboardModule,
    TeacherNotificationsModule,
    AdminStatisticsModule,
    AdminSettingsModule,
    AdminDashboardModule,
    AdminNotificationsModule,
    ChatModule,
    AiQuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}