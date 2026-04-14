import { Injectable } from '@nestjs/common';
import { RagService } from './rag.service';
import { CulturalProfileService } from './cultural-profile.service';
import { MapsService } from '../maps/maps.service';
import type { OverpassPoi } from '../maps/providers/overpass.provider';
import { IntentParserService } from './intent-parser.service';
import { CampaignsService } from '../campaigns/campaigns.service';

type ToolName = 'mapSearch' | 'nearbyPOI' | 'translate' | 'culturalRank' | 'emergencyHandler';

export interface ToolTrace {
  tool: ToolName;
  reason: string;
}

@Injectable()
export class AgenticService {
  constructor(
    private ragService: RagService,
    private culturalProfileService: CulturalProfileService,
    private mapsService: MapsService,
    private intentParser: IntentParserService,
    private campaignsService: CampaignsService,
  ) {}

  async conciergeAssist(params: {
    query: string;
    language: string;
    venueId: string;
    eventId?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    worldview?: string;
  }) {
    const parsedIntent = this.intentParser.parse(params.query, params.language);
    const toolsUsed: ToolTrace[] = [];

    toolsUsed.push({ tool: 'mapSearch', reason: 'Resolve user query to geocoded context and map features.' });
    toolsUsed.push({ tool: 'nearbyPOI', reason: 'Retrieve nearby place candidates around user location.' });
    toolsUsed.push({ tool: 'culturalRank', reason: 'Apply profile-aware ranking to recommendations.' });
    if (parsedIntent.intent === 'emergency' || parsedIntent.intent === 'medical') {
      toolsUsed.push({ tool: 'emergencyHandler', reason: 'Intent indicates safety-critical path.' });
    }

    const [contextDocs, venuePois, online, campaigns] = await Promise.all([
      this.ragService.retrieveContext({
        query: params.query,
        language: params.language,
        latitude: params.latitude,
        longitude: params.longitude,
        tags: [parsedIntent.intent],
      }),
      this.mapsService.searchVenuePOIs({
        venueId: params.venueId,
        language: params.language,
        category: parsedIntent.venueCategory,
        query: params.query,
      }),
      this.mapsService.searchOnlineContext({
        query: parsedIntent.normalizedQuery,
        language: params.language,
        worldview: params.worldview,
        latitude: params.latitude,
        longitude: params.longitude,
        amenities: parsedIntent.overpassAmenities,
      }),
      params.eventId
        ? this.campaignsService.getActiveCampaigns(params.eventId, 'concierge_card', params.language)
        : Promise.resolve([]),
    ]);

    const profile = this.culturalProfileService.getBaseProfile(params.language, 'atlanta', params.region);

    const rankedNearby = this.culturalProfileService.rerankRecommendations(
      profile,
      online.nearbyAmenities.map((a: OverpassPoi) => ({
        ...a,
        tags: [a.category, ...(a.tags?.cuisine ? [a.tags.cuisine] : [])],
      })),
    );

    const sponsorRecommendations = campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      sponsorName: campaign.sponsorName,
      ctaText: campaign.ctaText,
      ctaUrl: campaign.ctaUrl,
      badge: 'Official partner',
      reason: `Matched for ${params.language} audience and concierge placement.`,
      priorityScore: 0.9,
    }));

    const lowConfidence = contextDocs.length === 0;
    const explanation = lowConfidence
      ? 'I could not find high-confidence information for this query. Showing nearby results based on location only.'
      : 'Results routed by intent, geospatial retrieval, cultural ranking, and sponsor monetization layer.';

    return {
      intent: parsedIntent,
      toolsUsed,
      profile,
      contextDocs,
      venuePois,
      nearbyAmenities: rankedNearby,
      geocoding: online.geocoding,
      sponsorRecommendations,
      lowConfidence,
      explanation,
    };
  }
}
