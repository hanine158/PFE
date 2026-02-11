import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BadgeModule } from './badge/badge.module';
import { CoursModule } from './cours/cours.module';
import { ProgressModule } from './progress/progress.module';
import { PdfdocModule } from './pdfdoc/pdfdoc.module';
import { SchemaModule } from './schema/schema.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { AnalyseResModule } from './analyse-res/analyse-res.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port: 5432,
    username: 'postgres',
    password:'hanine',
    database: 'base1',
    entities:[__dirname +'/**/*.entity{.ts,.js}'],
    synchronize:true,

  }), UserModule, BadgeModule, CoursModule, ProgressModule, PdfdocModule, SchemaModule, QuizModule, QuestionModule, AnalyseResModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
