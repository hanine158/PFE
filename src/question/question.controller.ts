import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto, @Res() response) {
    try{
      const newQuestion = await this.questionService.create(createQuestionDto);
      return response.status(HttpStatus.CREATED).json({
        message : "question created successfully",
        question : newQuestion
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message : error.message

      })
    }
  
  
  }
@UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Res() response) {
    try{
      const questions = await this.questionService.findAll();
      return response.status(HttpStatus.OK).json({
        message : "questions retrieved successfully",
        questions : questions
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message : error.message

      })
    }
  }

  @Get(':id')
   async findOne(@Param('id') id: string, @Res() response) {
    try{
      const question = await this.questionService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message : "question retrieved successfully",
        question : question
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message : error.message

      })
    }
  }

  @Patch(':id')
   async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto, @Res() response) {
    try{
      const updatedQuestion = await this.questionService.update(id, updateQuestionDto);
      return response.status(HttpStatus.OK).json({
        message : "question updated successfully",
        question : updatedQuestion
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message : error.message

      })
    }
  }

  @Delete(':id')
 async remove(@Param('id') id: string, @Res() response) {
    try{
      const deletedQuestion = await this.questionService.remove(id);
      return response.status(HttpStatus.OK).json({
        message : "question deleted successfully",
        question : deletedQuestion
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message : error.message

      })
    }
  }
}
