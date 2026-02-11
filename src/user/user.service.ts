import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
   constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newuser = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(newuser);
  }

  
async findAll() : Promise <User[]>{
    const user=await this.userRepository.find()
    if(user.length==0){
      throw new NotFoundException("data not found")
    }
    return user
  }

  async findOne(id: number): Promise <User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise <User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise <User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}