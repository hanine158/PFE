import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { NotFoundError } from 'rxjs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge) private badgeRepository: Repository<Badge>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}
 async create(createBadgeDto: CreateBadgeDto) : Promise<Badge> {
  const user = await this.userRepository.findOne({where:{id:createBadgeDto.user} , relations:["badge"]});
      if(!user){
        throw new NotFoundException("user not found")
      }
    const newBadge = this.badgeRepository.create({...createBadgeDto, user});
    return await this.badgeRepository.save(newBadge);
  }

 async findAll() : Promise<Badge[]> {
    const newbadge = await this.badgeRepository.find();
    if (newbadge.length === 0) {
      throw new NotFoundException('no badges found');
    }
    return newbadge;
  }

  async findOne(id: number) : Promise<Badge> {
    const badge = await this.badgeRepository.findOneBy({id});
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
    return badge;
  }

 async update(id: number, updateBadgeDto: UpdateBadgeDto) : Promise<Badge> {
    const badge = await this.badgeRepository.preload({
      id,
    })
    if (!badge) {
      throw new NotFoundException('badge not found');
    }
    return await this.badgeRepository.save(badge);
  }

  async remove(id: number) {
    const badge = await this.findOne(id);
    return await this.badgeRepository.remove(badge);
  }
}
