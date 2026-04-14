import { Module } from '@nestjs/common';
import { AgenticController } from './agentic.controller';
import { AgenticService } from './agentic.service';
import { RagService } from './rag.service';
import { EmbeddingProvider } from './embedding.provider';
import { CulturalProfileService } from './cultural-profile.service';
import { IntentParserService } from './intent-parser.service';
import { MultilingualIntentService } from './multilingual-intent.service';
import { MapsModule } from '../maps/maps.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [MapsModule, CampaignsModule],
  controllers: [AgenticController],
  providers: [
    AgenticService,
    RagService,
    EmbeddingProvider,
    CulturalProfileService,
    IntentParserService,
    MultilingualIntentService,
  ],
  exports: [AgenticService],
})
export class AgenticModule {}
