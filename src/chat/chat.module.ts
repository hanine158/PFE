import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    NotificationModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}