// src/pdfdoc/pdfdoc.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pdfdoc } from './entities/pdfdoc.entity';
import { CreatePdfdocDto } from './dto/create-pdfdoc.dto';
import { UpdatePdfdocDto } from './dto/update-pdfdoc.dto';

@Injectable()
export class PdfdocService {
  constructor(
    @InjectRepository(Pdfdoc)
    private pdfdocRepository: Repository<Pdfdoc>,
  ) {}

  async create(createPdfdocDto: CreatePdfdocDto): Promise<Pdfdoc> {
    // ✅ Correction: create prend un objet, pas un tableau
    const pdfdoc = this.pdfdocRepository.create(createPdfdocDto);
    // ✅ Correction: save retourne un objet, pas un tableau
    return this.pdfdocRepository.save(pdfdoc);
  }

  async findAll(): Promise<Pdfdoc[]> {
    return this.pdfdocRepository.find();
  }

  async findOne(id: number): Promise<Pdfdoc> {
    const pdfdoc = await this.pdfdocRepository.findOne({ where: { id } });
    if (!pdfdoc) {
      throw new NotFoundException(`PDF avec l'ID ${id} non trouvé`);
    }
    return pdfdoc;
  }

  async update(id: number, updatePdfdocDto: UpdatePdfdocDto): Promise<Pdfdoc> {
    const pdfdoc = await this.findOne(id);
    Object.assign(pdfdoc, updatePdfdocDto);
    return this.pdfdocRepository.save(pdfdoc);
  }

  async remove(id: number): Promise<void> {
    const pdfdoc = await this.findOne(id);
    await this.pdfdocRepository.remove(pdfdoc);
  }
}