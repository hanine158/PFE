


import {
Controller, Get,Post,Body,Patch,Param,Delete,HttpStatus,Res,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import express from 'express';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto, @Res() response: express.Response, ) {
    try {
      const newUser = await this.userService.create(createUserDto);

      return response.status(HttpStatus.CREATED).json({
        message: 'Utilisateur créé avec succès',
        data: newUser,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message:
          "Erreur lors de la création de l'utilisateur : " + error.message,
      });
    }
  }

  @Get()
 async findAll(@Res()response) {
    try{
      const user=await this.userService.findAll();
      return response.status(HttpStatus.OK).json({
        message:"this all users",user
      })
    }catch(error){
       return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode : 400,
        message:"erreur data not found"+error.message
      })
      
    }
    
  }
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response: express.Response) {
    try {
      const user = await this.userService.findOne(+id);
      return response.status(HttpStatus.OK).json({
        message: "Utilisateur trouvé",
        data: user,
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Utilisateur non trouvé : " + error.message,
      });
    }
  }

  @Patch(':id')
 async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response: express.Response): Promise<express.Response> {
    try {
      const updatedUser = await this.userService.update(+id, updateUserDto);
      return response.status(HttpStatus.OK).json({
        message: "Utilisateur mis à jour avec succès",
        data: updatedUser,
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Erreur lors de la mise à jour de l'utilisateur : " + error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: express.Response) {
    try {
      const deletedUser = await this.userService.remove(+id);
      return response.status(HttpStatus.OK).json({
        message: "Utilisateur supprimé avec succès",
        data: deletedUser,
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Erreur lors de la suppression de l'utilisateur : " + error.message,
      });
    }
  }
}