import { Module } from '@nestjs/common';
import { AiQuizController } from './ai-quiz.controller';
import { AiQuizService } from './ai-quiz.service';

@Module({
  controllers: [AiQuizController],
  providers: [AiQuizService],
})
export class AiQuizModule {}