import { Module } from '@nestjs/common';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { EmergencyGateway } from './emergency.gateway';

@Module({
  controllers: [EmergencyController],
  providers: [EmergencyService, EmergencyGateway],
  exports: [EmergencyService],
})
export class EmergencyModule {}
