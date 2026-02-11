import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { AnalyseResService } from './analyse-res.service';
import { CreateAnalyseReDto } from './dto/create-analyse-re.dto';
import { UpdateAnalyseReDto } from './dto/update-analyse-re.dto';
import { response } from 'express';

@Controller('analyse-res')
export class AnalyseResController {
  constructor(private readonly analyseResService: AnalyseResService) {}

  @Post()
   async create(@Body() createAnalyseReDto: CreateAnalyseReDto, @Res() response) {
    try {
      const newAnalyseRes = await this.analyseResService.create(createAnalyseReDto);
      response.status(HttpStatus.CREATED).json(newAnalyseRes);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
   async findAll(@Res() response) {
    try {
      const analyseRes = await this.analyseResService.findAll();
      response.status(HttpStatus.OK).json(analyseRes);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Get(':id')
   async findOne(@Param('id') id: string, @Res() response) {
    try {
      const analyseRes = await this.analyseResService.findOne(+id);
      response.status(HttpStatus.OK).json(analyseRes);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Patch(':id')
   async update(@Param('id') id: string, @Body() updateAnalyseReDto: UpdateAnalyseReDto, @Res() response) {
    try {
      const updatedAnalyseRes = await this.analyseResService.update(+id, updateAnalyseReDto);
      response.status(HttpStatus.OK).json(updatedAnalyseRes);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const removedAnalyseRes = await this.analyseResService.remove(+id);
      response.status(HttpStatus.OK).json(removedAnalyseRes);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}
