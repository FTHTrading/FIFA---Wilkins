import { Injectable } from '@nestjs/common';
import { renderEmergencyTemplate } from '../templates/emergency-templates';
import { resolveSmsTemplate } from '../templates/sms-templates';

export interface EmergencyMessageInput {
  phraseKey: string;
  language: string;
  supportLink?: string;
}

@Injectable()
export class EmergencyMessageBuilder {
  build(input: EmergencyMessageInput): string {
    const primary = renderEmergencyTemplate(input.phraseKey, input.language);
    const escalation = resolveSmsTemplate('escalation_ack', input.language);
    const linkPart = input.supportLink ? ` Help: ${input.supportLink}` : '';
    return `${primary} ${escalation}${linkPart}`.trim();
  }
}
