import { buildTelecomAnalyticsEvent } from './telecom-analytics.util';

describe('telecom-analytics.util', () => {
  it('creates telecom analytics payload with sms channel metadata', () => {
    const event = buildTelecomAnalyticsEvent({
      type: 'telecom_inbound_sms',
      sessionId: 'sms_session_1',
      language: 'en',
      payload: { intent: 'food' },
    });

    expect(event.type).toBe('telecom_inbound_sms');
    expect(event.payload).toEqual({ channel: 'sms', intent: 'food' });
  });
});
