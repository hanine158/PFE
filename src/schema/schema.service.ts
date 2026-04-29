import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schema } from './entities/schema.entity';
import { Cour } from '../cours/entities/cour.entity';
import { CreateSchemaDto } from './dto/create-schema.dto';

@Injectable()
export class SchemaService {
  constructor(
    @InjectRepository(Schema)
    private readonly schemaRepository: Repository<Schema>,

    @InjectRepository(Cour)
    private readonly courRepository: Repository<Cour>,
  ) {}

  async publishSchema(courseId: number, dto: CreateSchemaDto) {
    const cour = await this.courRepository.findOne({
      where: { id: courseId },
    });

    if (!cour) {
      throw new NotFoundException('Cours introuvable');
    }

    const schema = this.schemaRepository.create({
      titre: dto.titre,
      contenu: dto.contenu,
      imageUrl: dto.imageUrl || null,
      cour,
    });

    const saved = await this.schemaRepository.save(schema);

    return {
      success: true,
      message: 'Schéma publié avec succès',
      schema: saved,
    };
  }

  async findAllByCourse(courseId: number) {
    return this.schemaRepository.find({
      where: {
        cour: {
          id: courseId,
        },
      },
      relations: ['cour'],
      order: {
        id: 'DESC',
      },
    });
  }

  async findLatestByCourse(courseId: number) {
    const schema = await this.schemaRepository.findOne({
      where: {
        cour: {
          id: courseId,
        },
      },
      relations: ['cour'],
      order: {
        id: 'DESC',
      },
    });

    return {
      success: !!schema,
      schema,
    };
  }

  async remove(id: number) {
    const schema = await this.schemaRepository.findOne({
      where: { id },
    });

    if (!schema) {
      throw new NotFoundException('Schéma introuvable');
    }

    await this.schemaRepository.remove(schema);

    return {
      success: true,
      message: 'Schéma supprimé',
    };
  }
}