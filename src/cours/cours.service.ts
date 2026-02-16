import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cour } from './entities/cour.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CoursService {
  constructor(
    @InjectRepository(Cour) private courRepository: Repository<Cour>,
        @InjectRepository(User) private userRepository: Repository<User>,

  ){}
  async create(createCourDto: CreateCourDto) : Promise<Cour>{
    const user = await this.userRepository.findOne({where:{id:createCourDto.user} , relations:["cour"]});
    if(!user){
      throw new NotFoundException("user not found")
    }
    const cour = this.courRepository.create({...createCourDto, user});
    return this.courRepository.save(cour);
  }

  async findAll() : Promise<Cour[]>{
    const cours = await this.courRepository.find();
    if(cours.length==0){
      throw new NotFoundException("cour data not found")
    }

    return cours;
  }

 async findOne(id: number) : Promise<Cour> {
    const cour = await this.courRepository.findOneBy({id:id});
    if(!cour){
      throw new NotFoundException("cour data not found")
    }
    return cour;
  }

  async update(id: number, updateCourDto: UpdateCourDto): Promise<Cour>{
    const cour = await this.findOne(id);
    if(!cour){
      throw new NotFoundException("cour data not found")
    }
    Object.assign(cour, updateCourDto);
    return this.courRepository.save(cour);
  }

  async remove(id: number) : Promise<Cour> {
    const cour = await this.findOne(id);
    return this.courRepository.remove(cour);
  }
}
