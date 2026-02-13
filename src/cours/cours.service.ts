import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cour } from './entities/cour.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursService {
  constructor(
    @InjectRepository(Cour) private courRepository: Repository<Cour>,
  ){}
  async create(createCourDto: CreateCourDto) : Promise<Cour>{
    const cour = this.courRepository.create(createCourDto);
    return this.courRepository.save(cour);
  }

  async findAll() : Promise<Cour[]>{
    const cours = await this.courRepository.find();
    if(cours.length==0){
      throw new NotFoundException("cour data not found")
    }

    return cours;
  }

 async findOne(id: string) : Promise<Cour> {
    const cour = await this.courRepository.findOneBy({id:id});
    if(!cour){
      throw new NotFoundException("cour data not found")
    }
    return cour;
  }

  async update(id: string, updateCourDto: UpdateCourDto): Promise<Cour>{
    const cour = await this.findOne(id);
    if(!cour){
      throw new NotFoundException("cour data not found")
    }
    return this.courRepository.save(cour);
  }

  async remove(id: string) : Promise<Cour> {
    const cour = await this.findOne(id);
    return this.courRepository.remove(cour);
  }
}
