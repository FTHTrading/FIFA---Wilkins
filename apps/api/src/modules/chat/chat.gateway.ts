import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  async handleJoin(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`conv:${data.conversationId}`);
    return { joined: true };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      conversationId: string;
      text: string;
      lang: string;
      senderType: 'guest' | 'staff';
      senderId?: string;
      translateTo?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.sendMessage({
      conversationId: data.conversationId,
      senderType: data.senderType,
      senderId: data.senderId,
      text: data.text,
      lang: data.lang,
      translateTo: data.translateTo,
    });

    // Broadcast to everyone in the conversation room
    this.server.to(`conv:${data.conversationId}`).emit('new_message', message);
    return message;
  }
}
