import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enseignant } from './entities/enseignant.entity';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

import * as argon2 from 'argon2';

@Injectable()
export class EnseignantService {
  constructor(
    @InjectRepository(Enseignant)
    private readonly repo: Repository<Enseignant>,
  ) {}

  async create(dto: CreateEnseignantDto): Promise<Enseignant> {
    const hashed = await argon2.hash(dto.password);
    const newEnseignant = this.repo.create({ ...dto, password: hashed });
    return this.repo.save(newEnseignant);
  }

  async findAll(): Promise<Enseignant[]> {
    const enseignants = await this.repo.find();
    if (!enseignants.length) throw new NotFoundException('No enseignants found');
    return enseignants;
  }

  async findOne(id: number): Promise<Enseignant> {
    const ens = await this.repo.findOneBy({ id });
    if (!ens) throw new NotFoundException(`Enseignant ${id} not found`);
    return ens;
  }

  async update(id: number, dto: UpdateEnseignantDto): Promise<Enseignant> {
    if (dto.password) dto.password = await argon2.hash(dto.password);
    const ens = await this.repo.preload({ id, ...dto });
    if (!ens) throw new NotFoundException('Enseignant not found');
    return this.repo.save(ens);
  }

  async remove(id: number): Promise<Enseignant> {
    const ens = await this.findOne(id);
    return this.repo.remove(ens);
  }

  async updatePassword(id: number, oldPass: string, newPass: string) {
    const ens = await this.findOne(id);
    const valid = await argon2.verify(ens.password, oldPass);
    if (!valid) throw new BadRequestException('Old password incorrect');

    ens.password = await argon2.hash(newPass);
    await this.repo.save(ens);
    return { success: true, message: 'Password updated successfully' };
  }
}