import { Injectable } from '@nestjs/common';

export interface CulturalProfile {
  profileId: string;
  languageCode: string;
  region?: string;
  cityContext?: string;
  dietaryPreferences: string[];
  behavior: string[];
  riskLevel: 'low' | 'needs_assistance';
  transportPreference: 'walking' | 'rideshare' | 'public_transit' | 'mixed';
  accessibilityNeeds: string[];
  confidence: number;
}

@Injectable()
export class CulturalProfileService {
  private readonly defaultsByLanguage: Record<string, {
    transportPreference: CulturalProfile['transportPreference'];
    dietaryPreferences: string[];
    behavior: string[];
  }> = {
    en: { transportPreference: 'mixed', dietaryPreferences: [], behavior: ['balanced'] },
    es: { transportPreference: 'public_transit', dietaryPreferences: [], behavior: ['social'] },
    ar: { transportPreference: 'rideshare', dietaryPreferences: ['halal'], behavior: ['family'] },
    ja: { transportPreference: 'public_transit', dietaryPreferences: [], behavior: ['quiet', 'structured'] },
    pt: { transportPreference: 'mixed', dietaryPreferences: [], behavior: ['social', 'late-night'] },
  };

  getBaseProfile(languageCode: string, cityContext?: string, region?: string): CulturalProfile {
    const defaults = this.defaultsByLanguage[languageCode] ?? {
      transportPreference: 'mixed' as const,
      dietaryPreferences: [],
      behavior: ['balanced'],
    };
    return {
      profileId: `profile:${languageCode}:${cityContext ?? 'default'}`,
      languageCode,
      region,
      cityContext,
      dietaryPreferences: defaults.dietaryPreferences,
      behavior: defaults.behavior,
      riskLevel: 'low',
      transportPreference: defaults.transportPreference ?? 'mixed',
      accessibilityNeeds: [],
      confidence: 0.45,
    };
  }

  rerankRecommendations<T extends { tags?: string[]; distanceM?: number }>(
    profile: CulturalProfile,
    items: T[],
  ): T[] {
    return [...items].sort((a, b) => {
      const scoreA = this.scoreItem(profile, a);
      const scoreB = this.scoreItem(profile, b);
      return scoreB - scoreA;
    });
  }

  private scoreItem(profile: CulturalProfile, item: { tags?: string[]; distanceM?: number }): number {
    const tags = item.tags ?? [];
    const distance = item.distanceM ?? 1500;

    const transportWeight =
      profile.transportPreference === 'walking'
        ? Math.max(0, 1 - distance / 1200)
        : profile.transportPreference === 'public_transit'
          ? tags.includes('transit') ? 1 : 0.45
          : 0.7;

    const dietaryWeight = profile.dietaryPreferences.length
      ? profile.dietaryPreferences.some((d) => tags.includes(d))
        ? 1
        : 0.4
      : 0.65;

    const behaviorWeight = profile.behavior.includes('quiet')
      ? (tags.includes('quiet') ? 1 : 0.55)
      : profile.behavior.includes('late-night')
        ? (tags.includes('late-night') ? 1 : 0.6)
        : 0.7;

    return 0.4 * transportWeight + 0.35 * dietaryWeight + 0.25 * behaviorWeight;
  }
}
