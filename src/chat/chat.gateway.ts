import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
    ],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log('✅ Chat Gateway initialisé');
  }

  handleConnection(client: Socket) {
    console.log(`🔌 Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client déconnecté: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`conversation_${data.conversationId}`);
    return { joined: true };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() dto: CreateMessageDto) {
    const savedMessage = await this.chatService.createMessage(dto);

    this.server
      .to(`conversation_${dto.conversationId}`)
      .emit('newMessage', savedMessage);

    return savedMessage;
  }
}