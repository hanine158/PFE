import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { AnalyseRe } from 'src/analyse-res/entities/analyse-re.entity';
import { Question } from 'src/question/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz , AnalyseRe , Question])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
