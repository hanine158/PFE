import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnalyseReDto } from './dto/create-analyse-re.dto';
import { UpdateAnalyseReDto } from './dto/update-analyse-re.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyseRe } from './entities/analyse-re.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyseResService {
  constructor(@InjectRepository(AnalyseRe) private analyseReRepository: Repository<AnalyseRe>)
  {}
  async create(createAnalyseReDto: CreateAnalyseReDto) : Promise<AnalyseRe>{
    const analyseRe = this.analyseReRepository.create(createAnalyseReDto);
    return await this.analyseReRepository.save(analyseRe);
  }

   async findAll() : Promise<AnalyseRe[]> {
   const analyseRes = await this.analyseReRepository.find();
   if(analyseRes.length==0){
    throw new NotFoundException("data not found")

   }
   return analyseRes;
  }

  async findOne(id: number) : Promise<AnalyseRe> {
    const analyseRe = await this.analyseReRepository.findOneBy({id});
    if(!analyseRe){
      throw new NotFoundException("analyseRes not found")
    }
    return analyseRe;
  }

  async update(id: number, updateAnalyseReDto: UpdateAnalyseReDto) : Promise<AnalyseRe> {
    const analyseRe = await this.analyseReRepository.preload({
      id,
      ...updateAnalyseReDto
    });
    if(!analyseRe){
      throw new NotFoundException("analyseRes not found")
    }
    return await this.analyseReRepository.save(analyseRe);
  }

 async remove(id: number)  : Promise<AnalyseRe> {
    const analyseRe = await this.findOne(id);
    return await this.analyseReRepository.remove(analyseRe);
  }
}
