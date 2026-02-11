import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schema } from './entities/schema.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchemaService {
  constructor(  @InjectRepository(Schema) private schemaRepository: Repository<Schema>)
  {}
  async create(createSchemaDto: CreateSchemaDto) : Promise<Schema>{
    const schema = this.schemaRepository.create(createSchemaDto);
    return this.schemaRepository.save(schema);
  }

  async findAll() : Promise<Schema[]>{
    const schemas = await this.schemaRepository.find();
    if(schemas.length==0){
      throw new NotFoundException("schema data not found")
    }

    return schemas;
  }

   async findOne(id: number) : Promise<Schema> {
    const schema = await this.schemaRepository.findOneBy({id});
    if(!schema){
      throw new NotFoundException("schema not found");
    }
    return schema;
  }

  async update(id: number, updateSchemaDto: UpdateSchemaDto) : Promise<Schema>{
    const schema = await this.findOne(id);
    if(!schema){
      throw new NotFoundException("schema not found");
    }
    Object.assign(schema, updateSchemaDto);
    return this.schemaRepository.save(schema);
  }

  async remove(id: number)  : Promise<Schema>{
    const schema = await this.findOne(id);
    return this.schemaRepository.remove(schema);
  }
}
