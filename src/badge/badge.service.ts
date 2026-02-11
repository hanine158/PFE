import { Injectable } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge) private badgeRepository: Repository<Badge>
  ){}
 async create(createBadgeDto: CreateBadgeDto) : Promise<Badge> {
    const newBadge = this.badgeRepository.create(createBadgeDto);
    return await this.badgeRepository.save(newBadge);
  }

 async findAll() : Promise<Badge[]> {
    const newbadge = await this.badgeRepository.find();
    if (newbadge.length === 0) {
      throw new NotFoundError('no badges found');
    }
    return newbadge;
  }

  async findOne(id: number) : Promise<Badge> {
    const badge = await this.badgeRepository.findOneBy({id});
    if (!badge) {
      throw new NotFoundError(`Badge with ID ${id} not found`);
    }
    return badge;
  }

 async update(id: number, updateBadgeDto: UpdateBadgeDto) : Promise<Badge> {
    const badge = await this.badgeRepository.preload({
      id,
      ...updateBadgeDto,
    })
    if (!badge) {
      throw new NotFoundError('badge not found');
    }
    return await this.badgeRepository.save(badge);
  }

  async remove(id: number) {
    const badge = await this.findOne(id);
    return await this.badgeRepository.remove(badge);
  }
}
