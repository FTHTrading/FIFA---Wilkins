import { MultilingualIntentService } from '../../agentic/multilingual-intent.service';
import {
  classifyTelecomIntent,
  detectSmsLanguage,
  resolveEmergencyPhraseKey,
} from './inbound-sms.processor';

describe('inbound-sms.processor', () => {
  const intentService = new MultilingualIntentService();

  it('detects inbound language for Spanish query', () => {
    const lang = detectSmsLanguage('Donde esta el bano?', intentService);
    expect(lang).toBe('es');
  });

  it('classifies multilingual emergency intent and forces emergency flag', () => {
    const result = classifyTelecomIntent('I lost my child please help', intentService);
    expect(result.emergencyFlag).toBe(true);
    expect(['emergency', 'medical']).toContain(result.intent);
  });

  it('classifies reward keyword intent from SMS body', () => {
    const result = classifyTelecomIntent('show me rewards and my badge', intentService);
    expect(result.intent).toBe('rewards');
    expect(result.rewardIntent).toBe(true);
  });

  it('maps emergency phrase key deterministically', () => {
    const key = resolveEmergencyPhraseKey('I lost my child at gate C');
    expect(key).toBe('lost_child');
  });
});
