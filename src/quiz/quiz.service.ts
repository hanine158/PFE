import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizService {
    constructor( @InjectRepository(Quiz) private quizRepository: Repository<Quiz>){}
  async create(createQuizDto: CreateQuizDto) : Promise<Quiz> {
    const quiz = this.quizRepository.create(createQuizDto);
    return await this.quizRepository.save(quiz);
  }

  async findAll() : Promise<Quiz[]>{
    const quizzes = await this.quizRepository.find();
   if(quizzes.length === 0){
    throw new NotFoundException("no quiz found");
   }
   return quizzes;
  }

  async findOne(id: number)  : Promise<Quiz>{
    const quiz = await this.quizRepository.findOneBy({id});
   if(!quiz){
   throw new NotFoundException('quiz not found');
   }
    return quiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) : Promise<Quiz> {
      const quiz = await this.quizRepository.findOneBy({id});
      if(!quiz){
        throw new NotFoundException("quiz not found");
      }
      Object.assign(quiz, updateQuizDto);
      return this.quizRepository.save(quiz);

  }

  async remove(id: number) : Promise<Quiz>  {
    const quiz = await this.quizRepository.findOneBy({id});
    if(!quiz){
      throw new NotFoundException("quiz not found");
    }
    return this.quizRepository.remove(quiz);
  }
}
