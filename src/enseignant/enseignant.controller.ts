import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { EnseignantService } from './enseignant.service';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('enseignant')
export class EnseignantController {
  constructor(private readonly service: EnseignantService) {}

  @Post('register')
  async create(@Body() dto: CreateEnseignantDto) {
    const ens = await this.service.create(dto);
    return { message: 'Enseignant created', data: ens };
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll() {
    return { message: 'All enseignants', data: await this.service.findAll() };
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { message: 'Enseignant found', data: await this.service.findOne(Number(id)) };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEnseignantDto) {
    return { message: 'Enseignant updated', data: await this.service.update(Number(id), dto) };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { message: 'Enseignant deleted', data: await this.service.remove(Number(id)) };
  }

 // @UseGuards(AccessTokenGuard)
 // @Put('update-password/:id')
 // async updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
  //  return this.service.updatePassword(Number(id), dto.oldPassword, dto.newPassword);
 // }
}