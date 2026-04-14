import { Injectable } from '@nestjs/common';

export interface RewardMessageInput {
  points: number;
  badgeNames: string[];
  rewardLink?: string;
}

@Injectable()
export class RewardMessageBuilder {
  build(input: RewardMessageInput): string {
    const badges = input.badgeNames.length > 0 ? input.badgeNames.slice(0, 3).join(', ') : 'No badges yet';
    const linkPart = input.rewardLink ? ` ${input.rewardLink}` : '';
    return `Rewards: ${input.points} pts. Badges: ${badges}.${linkPart}`.trim();
  }
}
