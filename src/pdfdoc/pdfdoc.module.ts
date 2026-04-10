// src/pdfdoc/pdfdoc.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfdocService } from './pdfdoc.service';
import { PdfdocController } from './pdfdoc.controller';
import { Pdfdoc } from './entities/pdfdoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pdfdoc])],
  controllers: [PdfdocController],
  providers: [PdfdocService],
  exports: [PdfdocService],
})
export class PdfdocModule {}