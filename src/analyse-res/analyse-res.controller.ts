import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AnalyseResService } from './analyse-res.service';
import { CreateAnalyseReDto } from './dto/create-analyse-re.dto';
import { UpdateAnalyseReDto } from './dto/update-analyse-re.dto';
import type { Response } from 'express'; // Changed to import type
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('analyse-res')
export class AnalyseResController {
  constructor(private readonly analyseResService: AnalyseResService) {}

  @Post()
  async create(@Body() createAnalyseReDto: CreateAnalyseReDto, @Res() response: Response) {
    try {
      const newAnalyseRes = await this.analyseResService.create(createAnalyseReDto);
      response.status(HttpStatus.CREATED).json(newAnalyseRes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      response.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    try {
      const analyseRes = await this.analyseResService.findAll();
      response.status(HttpStatus.OK).json(analyseRes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      response.status(HttpStatus.NOT_FOUND).json({ message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    try {
      const analyseRes = await this.analyseResService.findOne(+id);
      response.status(HttpStatus.OK).json(analyseRes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      response.status(HttpStatus.NOT_FOUND).json({ message });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAnalyseReDto: UpdateAnalyseReDto, @Res() response: Response) {
    try {
      const updatedAnalyseRes = await this.analyseResService.update(+id, updateAnalyseReDto);
      response.status(HttpStatus.OK).json(updatedAnalyseRes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      response.status(HttpStatus.NOT_FOUND).json({ message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    try {
      const removedAnalyseRes = await this.analyseResService.remove(+id);
      response.status(HttpStatus.OK).json(removedAnalyseRes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      response.status(HttpStatus.NOT_FOUND).json({ message });
    }
  }
}