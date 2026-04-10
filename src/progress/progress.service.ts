import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { NOTFOUND } from 'dns';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private progressRespository: Repository<Progress>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}
 async create(createProgressDto: CreateProgressDto) : Promise<Progress> {
  const user = await this.userRepository.findOne({where:{id:createProgressDto.user} , relations:["progress"]});
    if(!user){
      throw new NotFoundException("user not found")
    }
    const progress = this.progressRespository.create({...createProgressDto, user});
    return this.progressRespository.save(progress);
  }

  async findAll() : Promise<Progress[]> {
const progress = await this.progressRespository.find();
if(progress.length==0){
  throw new NotFoundException("progress data not found")

}
return progress;
  }

  async findOne() : Promise<Progress> {
    const progress = await this.progressRespository.findOneBy({});
    if(!progress){
      throw new NotFoundException("progress data not found")
    }
    
    return progress;
  }

 async update(id: number, updateProgressDto: UpdateProgressDto) : Promise<Progress> {
   const progress = await this.findOne();
    if(!progress){
      throw new NotFoundException("progress data not found")
    }
    Object.assign(progress, updateProgressDto);
    return this.progressRespository.save(progress);
     
   
  }

  async remove(id: number) : Promise<Progress> {
    const progress = await this.findOne();
    return this.progressRespository.remove(progress);
  }
}
