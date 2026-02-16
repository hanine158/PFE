import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { response } from 'express';
import { Progress } from './entities/progress.entity';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
 async create(@Body() createProgressDto: CreateProgressDto) {
   try{
    const progress = await this.progressService.create(createProgressDto);
    return response.status(HttpStatus.CREATED).json({
      message:"progress created successfully",
      progress
    })
   } catch(error) {
    return response.status(HttpStatus.BAD_REQUEST).json({
      message:"failed to create progress"+error.message,
    })
  }}

  @Get()
 async findAll(@Res() response) {
    try{
      const progress = await this.progressService.findAll();
      return response.status(HttpStatus.OK).json({
        message:"progress data retrieved successfully",
        progress
      })
    } catch(error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:"failed to retrieve progress data"+error.message,
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try {
      const progress= await this.progressService.findOne();
      return response.status(HttpStatus.OK).json({
        message :"progress data retrieved successfilly",
        progress
      })
    }catch(error){
      return response.status(HttpStatus.NOT_FOUND).json({
         statusCode: 404,
        message :"failed to retrieve progress data"+error.message,

      })
    }

    
    
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProgressDto: UpdateProgressDto, @Res() response) : Promise<Progress> {

     try {
      const updatedProgress = await this.progressService.update( id, updateProgressDto);
      return response.status(HttpStatus.OK).json({
        message :"progress updated successfully",
        data: updatedProgress
      })
     } catch(error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message :"failed to update progress"+error.message,
      })
     }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response) {
    try {
      const deletedProgress = await this.progressService.remove(id);
      return response.status(HttpStatus.OK).json({
        message :"progress deleted successfully",
        data: deletedProgress
      })
    } catch(error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message :"failed to delete progress"+error.message,
      })
    }
  }
}
