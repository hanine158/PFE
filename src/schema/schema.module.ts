import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Schema } from './entities/schema.entity';
import { Cour } from '../cours/entities/cour.entity';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schema, Cour])],
  controllers: [SchemaController],
  providers: [SchemaService],
  exports: [SchemaService],
})
export class SchemaModule {}