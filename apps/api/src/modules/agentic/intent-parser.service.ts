import { Injectable } from '@nestjs/common';
import { MultilingualIntentService } from './multilingual-intent.service';

export type GuestIntent =
  | 'food'
  | 'food-cultural'
  | 'restroom'
  | 'medical'
  | 'emergency'
  | 'exit'
  | 'transport'
  | 'translation'
  | 'directions'
  | 'shopping'
  | 'entertainment'
  | 'general';

export interface ParsedIntent {
  intent: GuestIntent;
  confidence: number;
  venueCategory?: string;
  overpassAmenities?: string[];
  culturalContext?: string;
  normalizedQuery: string;
}

@Injectable()
export class IntentParserService {
  constructor(private multilingualIntent: MultilingualIntentService) {}

  /**
   * Parse a guest query. Language defaults to 'en' when not provided for
   * backwards-compatibility with callers that haven't upgraded yet.
   */
  parse(query: string, languageCode = 'en'): ParsedIntent {
    const result = this.multilingualIntent.parse(query, languageCode);
    return {
      intent: result.intent as GuestIntent,
      confidence: result.confidence,
      venueCategory: result.venueCategory,
      overpassAmenities: result.overpassAmenities,
      culturalContext: result.culturalContext,
      normalizedQuery: result.normalizedQuery,
    };
  }
}

