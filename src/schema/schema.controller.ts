import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import express from 'express';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post()
  async create(@Body() createSchemaDto: CreateSchemaDto, @Res() response: express.Response){
    try {
      const newSchema = await this.schemaService.create(createSchemaDto);
      return response.status(HttpStatus.CREATED).json({
        message : "schema created successfully",
        data : newSchema


      })
  
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message : "Error creating schema:" + error.message,

      })
    }
    
  }

  @Get()
  async findAll(@Res() response: express.Response) {
    try {
      const schemas = await this.schemaService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "schemas retrieved successfully",
        data: schemas
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "Error retrieving schemas:" + error.message
      });
    }
  }

  @Get(':id')
   async findOne(@Param('id') id: string, @Res() response: express.Response) {
    try {
      const schema = await this.schemaService.findOne(+id);
      return response.status(HttpStatus.OK).json({
        message: "schema retrieved successfully",
        data: schema
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error retrieving schema:" + error.message
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSchemaDto: UpdateSchemaDto, @Res() response: express.Response) {
    try {
      const updatedSchema = await this.schemaService.update(+id, updateSchemaDto);
      return response.status(HttpStatus.OK).json({
        message: "schema updated successfully",
        data: updatedSchema
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error updating schema:" + error.message
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: express.Response) {
    try {
      await this.schemaService.remove(+id);
      return response.status(HttpStatus.OK).json({
        message: "schema removed successfully"
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error removing schema:" + error.message
      });
    }
  }
}
