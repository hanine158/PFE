import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schema } from './entities/schema.entity';
import { AnalyseRe } from '../analyse-res/entities/analyse-re.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Schema , AnalyseRe])],
  controllers: [SchemaController],
  providers: [SchemaService],
})
export class SchemaModule {}
