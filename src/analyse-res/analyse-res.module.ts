import { Module } from '@nestjs/common';
import { AnalyseResService } from './analyse-res.service';
import { AnalyseResController } from './analyse-res.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyseRe } from './entities/analyse-re.entity';
import { Schema } from '../schema/entities/schema.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Question } from '../question/entities/question.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AnalyseRe,Schema, Quiz , Question])],
  controllers: [AnalyseResController],
  providers: [AnalyseResService],
})
export class AnalyseResModule {}
