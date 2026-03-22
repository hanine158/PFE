import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnseignantService } from './enseignant.service';
import { EnseignantController } from './enseignant.controller';
import { Enseignant } from './entities/enseignant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enseignant])],
  controllers: [EnseignantController],
  providers: [EnseignantService],
})
export class EnseignantModule {}