import { Module } from '@nestjs/common';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { EmergencyGateway } from './emergency.gateway';
import { AuthModule } from '../auth/auth.module';
import { WsAuthGuard } from '@/common/guards/ws-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [EmergencyController],
  providers: [EmergencyService, EmergencyGateway, WsAuthGuard],
  exports: [EmergencyService],
})
export class EmergencyModule {}
