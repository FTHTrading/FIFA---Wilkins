import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  private resolveAction(phraseKey: string): 'map_route' | 'call_staff' | 'call_emergency' {
    if (phraseKey.includes('ambulance') || phraseKey.includes('fire') || phraseKey.includes('police')) {
      return 'call_emergency';
    }
    if (phraseKey.includes('lost_child') || phraseKey.includes('medical')) {
      return 'call_staff';
    }
    return 'map_route';
  }

  async getAllPhrases() {
    return this.prisma.emergencyPhrase.findMany({
      where: { isActive: true },
      orderBy: [{ urgency: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async getPhraseByKey(phraseKey: string) {
    return this.prisma.emergencyPhrase.findUniqueOrThrow({ where: { phraseKey } });
  }

  async getEmergencyOptions(language: string) {
    const phrases = await this.getAllPhrases();
    return phrases.map((phrase) => {
      const translations = (phrase.translations as Record<string, string> | null) ?? {};
      return {
        type: phrase.phraseKey,
        label: translations[language] ?? translations.en ?? phrase.phraseKey,
        english: translations.en ?? phrase.phraseKey,
        action: this.resolveAction(phrase.phraseKey),
      };
    });
  }

  async createIncident(data: {
    sessionId: string;
    phraseKey: string;
    eventId?: string;
    venueId?: string;
    language: string;
    location?: string;
  }) {
    return this.prisma.emergencyIncident.create({ data });
  }

  async acknowledgeIncident(id: string, staffId: string) {
    return this.prisma.emergencyIncident.update({
      where: { id },
      data: { status: 'acknowledged', staffId, acknowledgedAt: new Date() },
    });
  }
}
