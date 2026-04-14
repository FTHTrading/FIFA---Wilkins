import { Module } from '@nestjs/common';
import { AgenticModule } from '../agentic/agentic.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { EmergencyModule } from '../emergency/emergency.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TelecomController } from './telecom.controller';
import { TelecomService } from './telecom.service';
import { TelnyxProvider } from './providers/telnyx.provider';
import { OutboundMessageBuilder } from './processors/outbound-message.builder';
import { EmergencyMessageBuilder } from './processors/emergency-message.builder';
import { SponsorMessageBuilder } from './processors/sponsor-message.builder';
import { RewardMessageBuilder } from './processors/reward-message.builder';

@Module({
  imports: [AgenticModule, CampaignsModule, EmergencyModule, AnalyticsModule],
  controllers: [TelecomController],
  providers: [
    TelecomService,
    TelnyxProvider,
    OutboundMessageBuilder,
    EmergencyMessageBuilder,
    SponsorMessageBuilder,
    RewardMessageBuilder,
  ],
  exports: [TelecomService],
})
export class TelecomModule {}
