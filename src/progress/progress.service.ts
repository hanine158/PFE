import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { NOTFOUND } from 'dns';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private progressRespository: Repository<Progress>,
  ){}
 async create(createProgressDto: CreateProgressDto) : Promise<Progress> {
    const progress = this.progressRespository.create(createProgressDto);
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

 async update(id: string, updateProgressDto: UpdateProgressDto) {
  const progress = await this.progressRepository.findOne({
    where: { id },
  });

  if (!progress) {
    throw new Error('Progress not found');
  }

  Object.assign(progress, updateProgressDto);

  return await this.progressRepository.save(progress);
}


  async remove() : Promise<Progress> {
    const progress = await this.findOne();
    return this.progressRespository.remove(progress);
  }
}
