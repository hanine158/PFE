import { Module } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CoursController } from './cours.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cour } from './entities/cour.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Cour , User])],
  controllers: [CoursController],
  providers: [CoursService],
})
export class CoursModule {}
