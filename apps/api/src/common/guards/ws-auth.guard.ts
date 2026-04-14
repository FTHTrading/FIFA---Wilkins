import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

/**
 * WebSocket authentication guard.
 * Verifies JWT from the handshake auth token or query string.
 * Attaches decoded user payload to socket.data.user.
 */
@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token =
      client.handshake?.auth?.token ??
      client.handshake?.headers?.authorization?.replace('Bearer ', '');

    if (!token || typeof token !== 'string') {
      this.logger.warn(`WS auth rejected: no token from ${client.id}`);
      throw new WsException('Authentication required');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      return true;
    } catch {
      this.logger.warn(`WS auth rejected: invalid token from ${client.id}`);
      throw new WsException('Invalid or expired token');
    }
  }
}
