import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePdfdocDto } from './dto/create-pdfdoc.dto';
import { UpdatePdfdocDto } from './dto/update-pdfdoc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pdfdoc } from './entities/pdfdoc.entity';

@Injectable()
export class PdfdocService {
  constructor(
    @InjectRepository(Pdfdoc) private pdfdocRespository: Repository<Pdfdoc>,
  ){}
  async create(createPdfdocDto: CreatePdfdocDto) : Promise<Pdfdoc> {
    const pdfdoc = this.pdfdocRespository.create(createPdfdocDto);
    return this.pdfdocRespository.save(pdfdoc);
  }

  async findAll() : Promise<Pdfdoc[]> {
    const pdfdocs = await this.pdfdocRespository.find();
    if(pdfdocs.length==0){
      throw new NotFoundException("pdfdoc data not found")
    }
    return pdfdocs;
  }

  async findOne(id: string) : Promise<Pdfdoc> {
    const pdfdoc = await this.pdfdocRespository.findOneBy({id});
    if(!pdfdoc){
      throw new NotFoundException("pdfdoc data not found")
    }
    return pdfdoc;
  }

 async update(id: string, updatePdfdocDto: UpdatePdfdocDto) : Promise<Pdfdoc> {
    const pdfdoc = await this.pdfdocRespository.preload({
      id:id,
      ...updatePdfdocDto
    });
    if(!pdfdoc){
      throw new NotFoundException("pdfdoc data not found")
    }
    return this.pdfdocRespository.save(pdfdoc);
  }

   async remove(id: string) {
    const pdfdoc = await this.findOne(id);
    return this.pdfdocRespository.remove(pdfdoc);
  }
}
