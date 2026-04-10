import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import type { Response } from 'express'; // Changed to import type
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateSchemaDto } from './dto/create-schema.dto';

// Import Express namespace for Multer file type
import type { Express } from 'express';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post()
  @UseInterceptors(FileInterceptor("imageUrl", {
    storage: diskStorage({
      destination: './stockage',
      filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
      }
    })
  }))
  async create(@Body() createSchemaDto: CreateSchemaDto, @Res() response: Response, @UploadedFile() imageUrl: Express.Multer.File) {
    try {
      if (imageUrl) {
        createSchemaDto.imageUrl = imageUrl.filename;
      }

      const newSchema = await this.schemaService.create(createSchemaDto);
      return response.status(HttpStatus.CREATED).json({
        message: "schema created successfully",
        data: newSchema
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "Error creating schema: " + message,
      });
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    try {
      const schemas = await this.schemaService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "schemas retrieved successfully",
        data: schemas
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "Error retrieving schemas: " + message
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    try {
      const schema = await this.schemaService.findOne(+id);
      return response.status(HttpStatus.OK).json({
        message: "schema retrieved successfully",
        data: schema
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error retrieving schema: " + message
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor("imageUrl", {
    storage: diskStorage({
      destination: './stockage',
      filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
      }
    })
  }))
  async update(@Param('id') id: string, @Body() updateSchemaDto: UpdateSchemaDto, @Res() response: Response, @UploadedFile() imageUrl: Express.Multer.File) {
    try {
      const newimageUrl = imageUrl ? imageUrl.filename : null;
      if (newimageUrl) {
        updateSchemaDto.imageUrl = newimageUrl;
      }
      const updatedSchema = await this.schemaService.update(+id, updateSchemaDto);
      return response.status(HttpStatus.OK).json({
        message: "schema updated successfully",
        data: updatedSchema
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error updating schema: " + message
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    try {
      await this.schemaService.remove(+id);
      return response.status(HttpStatus.OK).json({
        message: "schema removed successfully"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error removing schema: " + message
      });
    }
  }
}