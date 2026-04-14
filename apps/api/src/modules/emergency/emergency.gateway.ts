import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { EmergencyService } from './emergency.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  },
  namespace: 'emergency',
})
export class EmergencyGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private emergencyService: EmergencyService) {}

  @SubscribeMessage('report_emergency')
  async handleEmergency(
    @MessageBody()
    data: { sessionId: string; phraseKey: string; language: string; eventId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const incident = await this.emergencyService.createIncident(data);
    // Broadcast to all staff monitoring this event
    this.server.to(`event:${data.eventId}`).emit('new_incident', incident);
    return { received: true, incidentId: incident.id };
  }
}
