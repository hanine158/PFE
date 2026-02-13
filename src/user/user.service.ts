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

  async findOne(id: string): Promise <User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise <User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise <User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email, password});
    if (!user) {
      throw new NotFoundException('invalid email or password');
    }
    return user;
  }
 async register(createUserDto: CreateUserDto) : Promise<User> {
    const existingUser = await this.userRepository.findOneBy({email: createUserDto.email});
    if (existingUser) {
      throw new NotFoundException('email already exists');


    }
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
    
 }

}