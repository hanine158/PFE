import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { response } from 'express';

@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post()
  async create(@Body() createCourDto: CreateCourDto, @Res() response) {
    try {
       const cour = await this.coursService.create(createCourDto);
       return response.status(HttpStatus.CREATED).json({
        message: "cour has been created successfully",
        cour
       
       })
    }catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
       statusCode:400,
        message : "Error: cour not created"+error.message,

      })
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const cours = await this.coursService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "All cours data retrieved successfully",
        cours
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode:400,
        message : "Error: cours data not retrieved"+error.message,

      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try {
      const cour = await this.coursService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "Cour data retrieved successfully",
        cour
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode:400,
        message : "Error: cour data not retrieved"+error.message,

      })
    }
  }

  @Patch(':id')
 async update(@Param('id') id: number, @Body() updateCourDto: UpdateCourDto, @Res() response) {
    try {
      const cour = await this.coursService.update(id, updateCourDto);
      return response.status(HttpStatus.OK).json({
        message: "Cour data updated successfully",
        cour
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode:400,
        message : "Error: cour data not updated"+error.message,

      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response) {
    try {
      const cour = await this.coursService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "Cour data removed successfully",
        cour
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode:400,
        message : "Error: cour data not removed"+error.message,

      })
    }
  }
}
