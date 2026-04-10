import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Badge } from '../badge/entities/badge.entity';
import { Cour } from '../cours/entities/cour.entity';
import { Progress } from '../progress/entities/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User
    ,Badge,Cour,Progress
  ])
],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
