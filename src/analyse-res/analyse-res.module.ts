import { Module } from '@nestjs/common';
import { AnalyseResService } from './analyse-res.service';
import { AnalyseResController } from './analyse-res.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyseRe } from './entities/analyse-re.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AnalyseRe])],
  controllers: [AnalyseResController],
  providers: [AnalyseResService],
})
export class AnalyseResModule {}
