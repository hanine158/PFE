import { Module } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CoursController } from './cours.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cour } from './entities/cour.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Cour])],
  controllers: [CoursController],
  providers: [CoursService],
})
export class CoursModule {}
