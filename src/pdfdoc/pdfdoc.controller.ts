import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { PdfdocService } from './pdfdoc.service';
import { CreatePdfdocDto } from './dto/create-pdfdoc.dto';
import { UpdatePdfdocDto } from './dto/update-pdfdoc.dto';
import { response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

 

@Controller('pdfdoc')
export class PdfdocController {
  constructor(private readonly pdfdocService: PdfdocService) {}

  @Post()
  async create(@Body() createPdfdocDto: CreatePdfdocDto , @Res() response) {
    try{
      const pdfdoc = await this.pdfdocService.create(createPdfdocDto);
      return response.status(HttpStatus.CREATED).json({
        message:"pdfdoc created successfully",
        pdfdoc
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:"failed to create pdfdoc"+error.message,
      })
    }
  }
@UseGuards(AccessTokenGuard)
  @Get()
 async findAll(@Res() response) {
    try{
      const pdfdocs = await this.pdfdocService.findAll();
      return response.status(HttpStatus.OK).json({
        message:"pdfdocs retrieved successfully",
        pdfdocs
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:"failed to retrieve pdfdocs"+error.message,
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try{
      const pdfdoc = await this.pdfdocService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message:"pdfdoc retrieved successfully",
        pdfdoc
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:"failed to retrieve pdfdoc"+error.message,
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePdfdocDto: UpdatePdfdocDto, @Res() response) {
    try{
      const pdfdoc = await this.pdfdocService.update(id, updatePdfdocDto);
      return response.status(HttpStatus.OK).json({
        message:"pdfdoc updated successfully",
        pdfdoc
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:"failed to update pdfdoc"+error.message,
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response) {
    try{
      await this.pdfdocService.remove(id);
      return response.status(HttpStatus.OK).json({
        message:"pdfdoc deleted successfully",
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message:"failed to delete pdfdoc"+error.message,
      })
    }
  }
}
