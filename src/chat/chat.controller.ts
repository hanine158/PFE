import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  async createConversation(@Body() dto: CreateConversationDto) {
    return await this.chatService.createOrGetConversation(dto);
  }

  @Get('conversations/:userId')
  async getConversations(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('role') role: 'student' | 'teacher',
  ) {
    return await this.chatService.getConversationsByUser(userId, role);
  }

  @Get('messages/:conversationId')
  async getMessages(
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return await this.chatService.getMessagesByConversation(conversationId);
  }

  @Post('messages')
  async createMessage(@Body() dto: CreateMessageDto) {
    return await this.chatService.createMessage(dto);
  }

  @Post('messages/read/:conversationId')
  async markAsRead(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body('role') role: 'student' | 'teacher',
  ) {
    return await this.chatService.markMessagesAsRead(conversationId, role);
  }
}