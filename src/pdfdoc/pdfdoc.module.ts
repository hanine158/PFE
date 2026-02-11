import { Module } from '@nestjs/common';
import { PdfdocService } from './pdfdoc.service';
import { PdfdocController } from './pdfdoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pdfdoc } from './entities/pdfdoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pdfdoc])],
  controllers: [PdfdocController],
  providers: [PdfdocService],
})
export class PdfdocModule {}
