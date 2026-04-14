import { Test, TestingModule } from '@nestjs/testing';
import { MultilingualIntentService } from './multilingual-intent.service';

describe('MultilingualIntentService', () => {
  let service: MultilingualIntentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultilingualIntentService],
    }).compile();
    service = module.get<MultilingualIntentService>(MultilingualIntentService);
  });

  // ─── English ─────────────────────────────────────────────────────────────
  describe('English', () => {
    it('detects emergency intent', () => {
      const r = service.parse('call an ambulance right now', 'en');
      expect(r.intent).toBe('emergency');
      expect(r.confidence).toBeGreaterThanOrEqual(0.9);
    });

    it('detects medical intent', () => {
      const r = service.parse('I need a hospital nearby', 'en');
      expect(r.intent).toBe('medical');
      expect(r.venueCategory).toBe('FIRST_AID');
    });

    it('detects food-cultural for halal', () => {
      const r = service.parse('halal food near the stadium', 'en');
      expect(r.intent).toBe('food-cultural');
      expect(r.culturalContext).toBe('cultural-dietary');
    });

    it('detects food-cultural for kosher', () => {
      const r = service.parse('Is there kosher food here?', 'en');
      expect(r.intent).toBe('food-cultural');
    });

    it('detects food intent for generic food query', () => {
      const r = service.parse('Where can I eat something?', 'en');
      expect(r.intent).toBe('food');
    });

    it('detects restroom intent', () => {
      const r = service.parse('Where is the nearest bathroom?', 'en');
      expect(r.intent).toBe('restroom');
      expect(r.confidence).toBeGreaterThanOrEqual(0.9);
    });

    it('detects exit intent', () => {
      const r = service.parse('How do I exit the stadium?', 'en');
      expect(r.intent).toBe('exit');
    });

    it('detects transport intent', () => {
      const r = service.parse('I need to take the MARTA train', 'en');
      expect(r.intent).toBe('transport');
    });

    it('detects translation intent', () => {
      const r = service.parse('Can you translate this sign for me?', 'en');
      expect(r.intent).toBe('translation');
    });

    it('falls back to general for unknown queries', () => {
      const r = service.parse('xyzzy plugh frobnitz', 'en');
      expect(r.intent).toBe('general');
    });
  });

  // ─── Spanish ─────────────────────────────────────────────────────────────
  describe('Spanish', () => {
    it('detects emergency', () => {
      const r = service.parse('necesito una ambulancia', 'es');
      expect(r.intent).toBe('emergency');
    });

    it('detects food-cultural for halal (es)', () => {
      const r = service.parse('comida halal cerca del estadio', 'es');
      expect(r.intent).toBe('food-cultural');
    });

    it('detects restroom in Spanish', () => {
      const r = service.parse('¿Dónde está el baño?', 'es');
      expect(r.intent).toBe('restroom');
    });

    it('detects transport in Spanish', () => {
      const r = service.parse('cómo tomar el metro', 'es');
      expect(r.intent).toBe('transport');
    });
  });

  // ─── Arabic ──────────────────────────────────────────────────────────────
  describe('Arabic', () => {
    it('detects food-cultural for halal in Arabic', () => {
      const r = service.parse('أحتاج طعام حلال قرب الملعب', 'ar');
      expect(r.intent).toBe('food-cultural');
      expect(r.culturalContext).toBe('cultural-dietary');
    });

    it('detects restroom in Arabic', () => {
      const r = service.parse('أين دورة المياه', 'ar');
      expect(r.intent).toBe('restroom');
    });

    it('detects medical in Arabic', () => {
      const r = service.parse('أين أقرب مستشفى؟', 'ar');
      expect(r.intent).toBe('medical');
    });

    it('detects transport in Arabic', () => {
      const r = service.parse('أحتاج مواصلات إلى الفندق', 'ar');
      expect(r.intent).toBe('transport');
    });

    it('detects emergency in Arabic', () => {
      const r = service.parse('نجدة، أحتاج إسعاف', 'ar');
      expect(r.intent).toBe('emergency');
    });
  });

  // ─── Japanese ────────────────────────────────────────────────────────────
  describe('Japanese', () => {
    it('detects restroom in Japanese', () => {
      const r = service.parse('最寄りのトイレはどこ', 'ja');
      expect(r.intent).toBe('restroom');
    });

    it('detects food-cultural in Japanese', () => {
      const r = service.parse('スタジアム近くの日本食レストラン', 'ja');
      expect(r.intent).toBe('food-cultural');
    });
  });

  // ─── Korean ──────────────────────────────────────────────────────────────
  describe('Korean', () => {
    it('detects food-cultural for Korean food', () => {
      const r = service.parse('경기장 근처 한식당', 'ko');
      expect(r.intent).toBe('food-cultural');
    });

    it('detects transport in Korean', () => {
      const r = service.parse('호텔로 가는 교통편', 'ko');
      expect(r.intent).toBe('transport');
    });
  });

  // ─── Portuguese ──────────────────────────────────────────────────────────
  describe('Portuguese', () => {
    it('detects food-cultural for Brazilian food', () => {
      const r = service.parse('comida brasileira em Atlanta', 'pt');
      expect(r.intent).toBe('food-cultural');
    });

    it('detects transport in Portuguese', () => {
      const r = service.parse('como chegar ao aeroporto', 'pt');
      expect(r.intent).toBe('transport');
    });
  });

  // ─── French ──────────────────────────────────────────────────────────────
  describe('French', () => {
    it('detects restroom in French', () => {
      const r = service.parse('où sont les toilettes', 'fr');
      expect(r.intent).toBe('restroom');
    });

    it('detects food-cultural for halal (fr)', () => {
      const r = service.parse('restaurant halal près du stade', 'fr');
      expect(r.intent).toBe('food-cultural');
    });
  });

  // ─── Bilingual / Cross-language ──────────────────────────────────────────
  describe('Cross-language fallback', () => {
    it('english keywords work even when language is ar', () => {
      // Bilingual query: Arabic speaker writes "halal food" in English
      const r = service.parse('halal food near me', 'ar');
      expect(r.intent).toBe('food-cultural');
    });

    it('matchedSignals is populated', () => {
      const r = service.parse('I need a hospital', 'en');
      expect(r.matchedSignals.length).toBeGreaterThan(0);
    });
  });
});
