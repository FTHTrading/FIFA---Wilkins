import { Injectable } from '@nestjs/common';

export interface SponsorMessageInput {
  sponsorName: string;
  campaignName: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

@Injectable()
export class SponsorMessageBuilder {
  build(input: SponsorMessageInput): string {
    const cta = input.ctaText?.trim() || 'Offer';
    const urlPart = input.ctaUrl ? ` ${input.ctaUrl}` : '';
    return `Offer: ${input.sponsorName} - ${input.campaignName}. ${cta}.${urlPart}`.trim();
  }
}
