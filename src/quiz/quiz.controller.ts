import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
 async create(@Body() createQuizDto: CreateQuizDto, @Res() response) {
    try {
      const newQuiz = await this.quizService.create(createQuizDto);
      return response.status(HttpStatus.CREATED).json({
        message: "quiz created successfully",
        quiz: newQuiz
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: "failed to create quiz",
      });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const quizzes = await this.quizService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "quizzes retrieved successfully",
        quizzes
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: "failed to retrieve quizzes"
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try {
      const quiz = await this.quizService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "quiz retrieved successfully",
        quiz
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: "failed to restrieve quiz",
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuizDto: UpdateQuizDto, @Res() response) {
    try {
      const updatedQuiz = await this.quizService.update(id, updateQuizDto);
      return response.status(HttpStatus.OK).json({
        message: "quiz updated successfully",
        quiz: updatedQuiz
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: "failed to update quiz",
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response) {
    try {
      const removedQuiz = await this.quizService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "quiz removed successfully",
        quiz: removedQuiz
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: "failed to delete quiz",
      });
    }
  }
}
