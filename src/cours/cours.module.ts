// src/cours/cours.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CoursService } from './cours.service';
import { CoursController } from './cours.controller';
import { Cour } from './entities/cour.entity';
import { User } from '../user/entities/user.entity';
import { Pdfdoc } from '../pdfdoc/entities/pdfdoc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cour, User, Pdfdoc]),
    MulterModule.register({
      dest: './uploads/pdfs',
    }),
  ],
  controllers: [CoursController],
  providers: [CoursService],
  exports: [CoursService]
})
export class CoursModule {}