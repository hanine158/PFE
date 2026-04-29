import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { CreateSchemaDto } from './dto/create-schema.dto';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post('course/:courseId/publish')
  publish(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() dto: CreateSchemaDto,
  ) {
    return this.schemaService.publishSchema(courseId, dto);
  }

  @Get('course/:courseId/latest')
  findLatestByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.schemaService.findLatestByCourse(courseId);
  }

  @Get('course/:courseId')
  findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.schemaService.findAllByCourse(courseId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schemaService.remove(id);
  }
}