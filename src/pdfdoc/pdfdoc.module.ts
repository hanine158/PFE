import { Module } from '@nestjs/common';
import { PdfdocService } from './pdfdoc.service';
import { PdfdocController } from './pdfdoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pdfdoc } from './entities/pdfdoc.entity';
import { Cour } from 'src/cours/entities/cour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pdfdoc , Cour])],
  controllers: [PdfdocController],
  providers: [PdfdocService],
})
export class PdfdocModule {}
