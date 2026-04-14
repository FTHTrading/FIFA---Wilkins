import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { WsAuthGuard } from '@/common/guards/ws-auth.guard';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES_PER_MINUTE = 30;

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  },
  namespace: 'chat',
  pingInterval: 25_000,
  pingTimeout: 20_000,
})
@UseGuards(WsAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly messageCounts = new Map<string, { count: number; resetAt: number }>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Chat client disconnected: ${client.id}`);
    this.messageCounts.delete(client.id);
  }

  private checkRateLimit(clientId: string): void {
    const now = Date.now();
    const entry = this.messageCounts.get(clientId);
    if (!entry || now > entry.resetAt) {
      this.messageCounts.set(clientId, { count: 1, resetAt: now + 60_000 });
      return;
    }
    entry.count++;
    if (entry.count > MAX_MESSAGES_PER_MINUTE) {
      throw new WsException('Rate limit exceeded — max 30 messages per minute');
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoin(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.conversationId || typeof data.conversationId !== 'string') {
      throw new WsException('Invalid conversationId');
    }
    await client.join(`conv:${data.conversationId}`);
    this.logger.debug(`Client ${client.id} joined conv:${data.conversationId}`);
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
    // Validate required fields
    if (!data?.conversationId || !data?.text || !data?.lang || !data?.senderType) {
      throw new WsException('Missing required fields: conversationId, text, lang, senderType');
    }
    if (data.text.length > MAX_MESSAGE_LENGTH) {
      throw new WsException(`Message exceeds max length of ${MAX_MESSAGE_LENGTH} characters`);
    }
    if (!['guest', 'staff'].includes(data.senderType)) {
      throw new WsException('senderType must be "guest" or "staff"');
    }

    this.checkRateLimit(client.id);

    try {
      const message = await this.chatService.sendMessage({
        conversationId: data.conversationId,
        senderType: data.senderType,
        senderId: data.senderId,
        text: data.text,
        lang: data.lang,
        translateTo: data.translateTo,
      });

      this.server.to(`conv:${data.conversationId}`).emit('new_message', message);
      return message;
    } catch (error) {
      this.logger.error(`send_message failed for client ${client.id}: ${error}`);
      throw new WsException('Failed to send message');
    }
  }
}
