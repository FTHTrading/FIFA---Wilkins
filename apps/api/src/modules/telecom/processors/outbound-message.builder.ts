import { Injectable } from '@nestjs/common';
import type { OutboundBuildInput, OutboundBuildResult } from '../telecom.types';

const MAX_SMS_CHARS = 640;

@Injectable()
export class OutboundMessageBuilder {
  build(input: OutboundBuildInput): OutboundBuildResult {
    const segments: string[] = [];
    if (input.greeting) segments.push(input.greeting);
    for (const line of input.primaryLines) {
      if (line.trim()) segments.push(line.trim());
    }
    if (input.mapLink) segments.push(`Map: ${input.mapLink}`);
    if (input.sponsorLine) segments.push(input.sponsorLine);
    if (input.rewardLine) segments.push(input.rewardLine);
    if (input.footer) segments.push(input.footer);

    let body = segments.join('\n');
    if (body.length > MAX_SMS_CHARS) {
      body = `${body.slice(0, MAX_SMS_CHARS - 3)}...`;
    }

    return { body, segments };
  }
}

export function shouldInjectSponsorOffer(intent: string, emergencyFlag: boolean): boolean {
  if (emergencyFlag) return false;
  if (intent === 'medical' || intent === 'emergency') return false;
  return true;
}
