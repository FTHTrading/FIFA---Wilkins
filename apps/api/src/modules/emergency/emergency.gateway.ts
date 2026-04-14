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
import { EmergencyService } from './emergency.service';
import { WsAuthGuard } from '@/common/guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  },
  namespace: 'emergency',
  pingInterval: 10_000,
  pingTimeout: 10_000,
})
@UseGuards(WsAuthGuard)
export class EmergencyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EmergencyGateway.name);

  constructor(private emergencyService: EmergencyService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Emergency client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Emergency client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_event')
  async handleJoinEvent(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.eventId || typeof data.eventId !== 'string') {
      throw new WsException('Invalid eventId');
    }
    await client.join(`event:${data.eventId}`);
    this.logger.log(`Staff client ${client.id} monitoring event:${data.eventId}`);
    return { joined: true };
  }

  @SubscribeMessage('report_emergency')
  async handleEmergency(
    @MessageBody()
    data: { sessionId: string; phraseKey: string; language: string; eventId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.sessionId || !data?.phraseKey || !data?.language) {
      throw new WsException('Missing required fields: sessionId, phraseKey, language');
    }

    try {
      const incident = await this.emergencyService.createIncident(data);
      this.logger.warn(
        `EMERGENCY reported by session=${data.sessionId} phrase=${data.phraseKey} event=${data.eventId ?? 'none'}`,
      );
      // Broadcast to all staff monitoring this event
      if (data.eventId) {
        this.server.to(`event:${data.eventId}`).emit('new_incident', incident);
      }
      return { received: true, incidentId: incident.id };
    } catch (error) {
      this.logger.error(`Emergency report failed for session=${data.sessionId}: ${error}`);
      throw new WsException('Failed to report emergency — staff has been notified');
    }
  }
}
