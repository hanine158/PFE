import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyseRe } from '../analyse-res/entities/analyse-re.entity';
import { Quiz } from '../quiz/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question , AnalyseRe, Quiz])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
