import { OutboundMessageBuilder, shouldInjectSponsorOffer } from './outbound-message.builder';
import { RewardMessageBuilder } from './reward-message.builder';

describe('outbound-message.builder', () => {
  const builder = new OutboundMessageBuilder();
  const rewardBuilder = new RewardMessageBuilder();

  it('formats outbound concierge SMS with lines and links', () => {
    const result = builder.build({
      language: 'en',
      greeting: 'Text FIFA',
      primaryLines: ['1. Option A', '2. Option B'],
      mapLink: 'https://example.com/map',
      footer: 'Text FIFA for live help.',
    });

    expect(result.body).toContain('Text FIFA');
    expect(result.body).toContain('1. Option A');
    expect(result.body).toContain('Map: https://example.com/map');
  });

  it('suppresses sponsor injection during emergency', () => {
    expect(shouldInjectSponsorOffer('emergency', true)).toBe(false);
    expect(shouldInjectSponsorOffer('food', false)).toBe(true);
  });

  it('generates reward summary link text', () => {
    const rewardText = rewardBuilder.build({
      points: 120,
      badgeNames: ['Fan Navigator', 'Cultural Explorer'],
      rewardLink: 'https://example.com/rewards',
    });

    expect(rewardText).toContain('120 pts');
    expect(rewardText).toContain('https://example.com/rewards');
  });
});
