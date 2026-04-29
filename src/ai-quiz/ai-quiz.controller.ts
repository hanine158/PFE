import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiQuizService } from './ai-quiz.service';

@Controller('ai-quiz')
export class AiQuizController {
  constructor(private readonly aiQuizService: AiQuizService) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('file'))
  async generateQuiz(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier PDF reçu.');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Le fichier doit être un PDF.');
    }

    return this.aiQuizService.generateQuiz(file);
  }

  @Post('course/:courseId/generate-publish')
  async generateAndPublishQuiz(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() body: { pdf?: string; titre?: string },
  ) {
    return this.aiQuizService.generateAndPublishQuiz(courseId, body);
  }
}