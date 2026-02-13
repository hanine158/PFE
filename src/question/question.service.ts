import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class QuestionService {
  constructor( @InjectRepository(Question) private questionRepository: any) {}
  async create(createQuestionDto: CreateQuestionDto) : Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  async findAll() : Promise<Question[]>{
    const questions = await this.questionRepository.find();
    return questions;
  }

   async findOne(id: string)  : Promise<Question>{
    const question = await this.questionRepository.findOneBy({id});
    if(!question){
      throw new NotFoundError("question not found");
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) : Promise<Question> {
    const question = await this.findOne(id);
   if(!question){

    throw new NotFoundError("question not found");
   }
    Object.assign(question, updateQuestionDto);
    return this.questionRepository.save(question);
  }

  async remove(id: string) : Promise<Question> {
    const question = await this.findOne(id);
    if(!question){
      throw new NotFoundError("question not found");
    }
    return this.questionRepository.remove(question);
  }
}
