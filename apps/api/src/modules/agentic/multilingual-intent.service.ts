import { Injectable } from '@nestjs/common';

/**
 * Language-aware keyword intent classifier.
 *
 * Covers 10 languages: en, es, fr, pt, ar, ja, ko, zh-CN, de, it.
 * Falls back to English matching for unmapped language codes.
 *
 * Returns the highest-confidence intent match, with a structured
 * explanation of which signals triggered the classification.
 */

export type MultilingualGuestIntent =
  | 'food'
  | 'food-cultural'
  | 'restroom'
  | 'medical'
  | 'emergency'
  | 'exit'
  | 'transport'
  | 'translation'
  | 'directions'
  | 'shopping'
  | 'entertainment'
  | 'general';

export interface MultilingualParsedIntent {
  intent: MultilingualGuestIntent;
  confidence: number;
  detectedLanguage: string;
  matchedSignals: string[];
  venueCategory?: string;
  overpassAmenities?: string[];
  culturalContext?: string;
  normalizedQuery: string;
}

// ─── Keyword Tables ────────────────────────────────────────────────────────────
// Each entry is a tuple: [intent, baseConfidence, venueCategory, amenities[], culturalContext?]
// culturalContext is set for food-cultural to drive the RAG retrieval.

type IntentEntry = {
  intent: MultilingualGuestIntent;
  confidence: number;
  venueCategory?: string;
  amenities?: string[];
  culturalContext?: string;
  keywords: string[];
};

const INTENT_DB: Record<string, IntentEntry[]> = {
  // ─── English (en) ─────────────────────────────────────────────────────────
  en: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['ambulance', '911', 'dying', 'heart attack', 'choking', 'unconscious', 'bleeding badly'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital', 'clinic', 'pharmacy'],
      keywords: ['hospital', 'medical', 'doctor', 'hurt', 'injury', 'first aid', 'sick', 'pain', 'injured', 'pharmacy'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      culturalContext: 'cultural-dietary',
      keywords: [
        'halal', 'kosher', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free',
        'food from home', 'authentic', 'home food', 'traditional food', 'my cuisine',
        'japanese food', 'korean food', 'chinese food', 'mexican food', 'indian food',
        'middle eastern food', 'ethiopian', 'thai food', 'vietnamese food',
      ],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'fast_food', 'cafe'],
      keywords: ['food', 'eat', 'hungry', 'restaurant', 'drink', 'beer', 'snack', 'lunch', 'dinner', 'meal', 'burger'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['bathroom', 'restroom', 'toilet', 'wc', 'washroom', 'lavatory', 'facilities'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      amenities: ['parking', 'bus_station', 'taxi'],
      keywords: ['exit', 'leave', 'way out', 'outside', 'out of', 'gate', 'entrance'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      amenities: ['bus_station', 'taxi', 'parking', 'subway_entrance'],
      keywords: ['bus', 'train', 'subway', 'metro', 'uber', 'lyft', 'ride', 'transport', 'taxi', 'shuttle', 'airport', 'marta'],
    },
    {
      intent: 'directions',
      confidence: 0.85,
      keywords: ['where is', 'how do i get', 'how to get', 'directions', 'navigate', 'find', 'location of', 'map'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['translate', 'translation', 'language', 'what does', 'what is this', 'scan', 'read this'],
    },
    {
      intent: 'shopping',
      confidence: 0.83,
      venueCategory: 'MERCHANDISE',
      keywords: ['shop', 'merchandise', 'buy', 'gift', 'souvenir', 'store', 'jersey', 'hat'],
    },
    {
      intent: 'entertainment',
      confidence: 0.80,
      keywords: ['concert', 'show', 'performance', 'schedule', 'lineup', 'stage', 'game', 'match'],
    },
  ],

  // ─── Spanish (es) ─────────────────────────────────────────────────────────
  es: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['ambulancia', 'emergencia', 'infarto', 'inconsciente', 'socorro'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital', 'farmacia'],
      keywords: ['hospital', 'médico', 'doctor', 'herido', 'lesión', 'primeros auxilios', 'enfermo', 'dolor', 'farmacia'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      culturalContext: 'cultural-dietary',
      keywords: ['halal', 'kosher', 'vegano', 'vegetariano', 'comida mexicana', 'comida de mi país', 'comida típica', 'auténtico'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'fast_food', 'cafe'],
      keywords: ['comida', 'comer', 'hambre', 'restaurante', 'beber', 'cerveza', 'almuerzo', 'cena', 'desayuno', 'snack'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['baño', 'sanitario', 'wc', 'servicio', 'aseo', 'toilette', 'lavabo'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['salida', 'puerta', 'salir', 'afuera', 'cómo salir'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      amenities: ['bus_station', 'taxi'],
      keywords: ['bus', 'tren', 'metro', 'uber', 'taxi', 'transporte', 'autobús', 'aeropuerto', 'cómo llegar'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['traducir', 'traducción', 'idioma', 'qué significa', 'no entiendo'],
    },
  ],

  // ─── French (fr) ──────────────────────────────────────────────────────────
  fr: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['ambulance', 'urgence', 'crise cardiaque', 'inconscient', 'au secours'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['hôpital', 'pharmacie'],
      keywords: ['hôpital', 'médecin', 'docteur', 'blessé', 'blessure', 'premiers secours', 'pharmacie', 'douleur'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant'],
      culturalContext: 'cultural-dietary',
      keywords: ['halal', 'casher', 'végétalien', 'végétarien', 'cuisine française', 'cuisine marocaine', 'cuisines du monde', 'authentique'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['nourriture', 'manger', 'faim', 'restaurant', 'boire', 'bière', 'déjeuner', 'dîner', 'collation'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['toilettes', 'wc', 'sanitaires', 'lavabo', 'cabinet'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['sortie', 'porte', 'sortir', 'dehors', 'comment sortir'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['bus', 'train', 'métro', 'uber', 'taxi', 'transport', 'aéroport', 'comment aller'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['traduire', 'traduction', 'langue', 'que signifie', 'je ne comprends pas'],
    },
  ],

  // ─── Portuguese (pt) ──────────────────────────────────────────────────────
  pt: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['ambulância', 'emergência', 'infarto', 'inconsciente', 'socorro'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital', 'farmácia'],
      keywords: ['hospital', 'médico', 'doutor', 'ferido', 'lesão', 'primeiros socorros', 'farmácia', 'dor'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant'],
      culturalContext: 'cultural-dietary',
      keywords: ['halal', 'kosher', 'vegano', 'vegetariano', 'comida brasileira', 'comida portuguesa', 'culinária típica', 'autêntico'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['comida', 'comer', 'fome', 'restaurante', 'beber', 'cerveja', 'almoço', 'jantar', 'lanche'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['banheiro', 'wc', 'sanitário', 'toalete', 'lavabo'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['saída', 'porta', 'sair', 'fora', 'como sair'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['ônibus', 'metrô', 'trem', 'uber', 'táxi', 'transporte', 'aeroporto', 'como chegar'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['traduzir', 'tradução', 'idioma', 'o que significa', 'não entendo'],
    },
  ],

  // ─── Arabic (ar) ──────────────────────────────────────────────────────────
  ar: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['إسعاف', 'طوارئ', 'نوبة قلبية', 'فاقد الوعي', 'نجدة'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital', 'clinic', 'pharmacy'],
      keywords: ['مستشفى', 'طبيب', 'دكتور', 'جرح', 'إصابة', 'إسعافات', 'صيدلية', 'ألم', 'علاج'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.93,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      culturalContext: 'cultural-dietary',
      keywords: ['حلال', 'طعام حلال', 'مطعم حلال', 'طعام عربي', 'مطبخ عربي', 'أكل من بلدي', 'أكل بلدي', 'حلال قريب', 'كباب', 'شاورما', 'فلافل'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['طعام', 'أكل', 'جائع', 'مطعم', 'شرب', 'غداء', 'عشاء', 'وجبة'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['دورة المياه', 'مرحاض', 'حمام', 'توالت', 'دورة مياه'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['مخرج', 'خروج', 'باب', 'كيف أخرج', 'الخروج'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['حافلة', 'قطار', 'مترو', 'أوبر', 'تاكسي', 'مواصلات', 'مطار', 'كيف أصل'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['ترجمة', 'ترجم', 'لغة', 'ماذا يعني', 'لا أفهم'],
    },
  ],

  // ─── Japanese (ja) ────────────────────────────────────────────────────────
  ja: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['救急車', '緊急', '助けて', '意識不明', '心臓発作'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital', 'pharmacy'],
      keywords: ['病院', '医者', '怪我', '救急', '薬局', '痛い', '具合悪い'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      culturalContext: 'cultural-dietary',
      keywords: ['和食', '日本食', 'すし', 'ラーメン', '天ぷら', 'ハラール', 'ベジタリアン', '本格的'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['食べ物', '食べる', 'お腹すいた', 'レストラン', '飲む', 'ランチ', '夕食', '軽食'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['トイレ', '洗面所', 'お手洗い', 'バスルーム', '化粧室'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['出口', '出る', '外', 'ゲート', 'どこで出る'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['バス', '電車', '地下鉄', 'ウーバー', 'タクシー', '空港', 'どうやって行く'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['翻訳', '訳す', '言語', 'どういう意味', 'わかりません'],
    },
  ],

  // ─── Korean (ko) ──────────────────────────────────────────────────────────
  ko: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['구급차', '응급', '도와주세요', '의식불명', '심장마비'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['병원', '약국'],
      keywords: ['병원', '의사', '부상', '응급처치', '약국', '아프다', '통증'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.92,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant'],
      culturalContext: 'cultural-dietary',
      keywords: ['한식', '한국 음식', '비빔밥', '불고기', '치킨', '할랄', '채식', '정통'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['음식', '먹다', '배고프다', '식당', '레스토랑', '마시다', '점심', '저녁', '간식'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['화장실', '변기', '세면대', '욕실'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['출구', '나가다', '밖', '게이트', '어떻게 나가요'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['버스', '기차', '지하철', '우버', '택시', '공항', '어떻게 가요'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['번역', '언어', '무슨 뜻', '이해 못해'],
    },
  ],

  // ─── Mandarin Chinese (zh-CN) ─────────────────────────────────────────────
  'zh-CN': [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['救护车', '急救', '帮帮我', '心脏病发', '失去意识'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['医院', '药房'],
      keywords: ['医院', '医生', '受伤', '急救', '药店', '疼痛', '生病'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant'],
      culturalContext: 'cultural-dietary',
      keywords: ['中餐', '中国菜', '清真', '素食', '地道', '家乡味', '粤菜', '川菜'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['食物', '吃', '饿了', '餐厅', '喝', '午饭', '晚饭', '点心'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['洗手间', '厕所', '卫生间', '厕所在哪'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['出口', '出去', '离开', '大门', '怎么出去'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['公交', '地铁', '火车', '出租车', '滴滴', '机场', '怎么去'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['翻译', '语言', '什么意思', '看不懂'],
    },
  ],

  // ─── German (de) ──────────────────────────────────────────────────────────
  de: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['krankenwagen', 'notfall', 'herzanfall', 'bewusstlos', 'hilfe'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['krankenhaus', 'apotheke'],
      keywords: ['krankenhaus', 'arzt', 'verletzt', 'erste hilfe', 'apotheke', 'schmerzen', 'krank'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant'],
      culturalContext: 'cultural-dietary',
      keywords: ['halal', 'koscher', 'vegan', 'vegetarisch', 'deutsche küche', 'heimatküche'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['essen', 'hunger', 'restaurant', 'trinken', 'bier', 'mittagessen', 'abendessen'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['toilette', 'wc', 'klo', 'badezimmer', 'sanitär'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['ausgang', 'raus', 'draußen', 'tor', 'wie komme ich raus'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['bus', 'bahn', 'u-bahn', 'uber', 'taxi', 'flughafen', 'wie komme ich'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['übersetzen', 'übersetzung', 'sprache', 'was bedeutet', 'ich verstehe nicht'],
    },
  ],

  // ─── Italian (it) ─────────────────────────────────────────────────────────
  it: [
    {
      intent: 'emergency',
      confidence: 0.98,
      venueCategory: 'FIRST_AID',
      amenities: ['hospital'],
      keywords: ['ambulanza', 'emergenza', 'infarto', 'incosciente', 'aiuto'],
    },
    {
      intent: 'medical',
      confidence: 0.93,
      venueCategory: 'FIRST_AID',
      amenities: ['ospedale', 'farmacia'],
      keywords: ['ospedale', 'medico', 'dottore', 'ferito', 'pronto soccorso', 'farmacia', 'dolore', 'malato'],
    },
    {
      intent: 'food-cultural',
      confidence: 0.91,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant'],
      culturalContext: 'cultural-dietary',
      keywords: ['halal', 'vegano', 'vegetariano', 'cucina italiana', 'cibo tipico', 'autentico'],
    },
    {
      intent: 'food',
      confidence: 0.88,
      venueCategory: 'CONCESSION',
      amenities: ['restaurant', 'cafe'],
      keywords: ['cibo', 'mangiare', 'fame', 'ristorante', 'bere', 'pranzo', 'cena', 'spuntino'],
    },
    {
      intent: 'restroom',
      confidence: 0.95,
      venueCategory: 'RESTROOM',
      amenities: ['toilets'],
      keywords: ['bagno', 'toilette', 'wc', 'servizi igienici'],
    },
    {
      intent: 'exit',
      confidence: 0.90,
      venueCategory: 'GATE',
      keywords: ['uscita', 'uscire', 'fuori', 'cancello', 'come si esce'],
    },
    {
      intent: 'transport',
      confidence: 0.87,
      venueCategory: 'TRANSPORT',
      keywords: ['autobus', 'treno', 'metropolitana', 'uber', 'taxi', 'aeroporto', 'come si va'],
    },
    {
      intent: 'translation',
      confidence: 0.82,
      keywords: ['tradurre', 'traduzione', 'lingua', 'cosa significa', 'non capisco'],
    },
  ],
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class MultilingualIntentService {
  /**
   * Parse a guest query in any supported language and return
   * a structured intent with confidence and matched signals.
   *
   * @param query - Raw query text from the guest (any language)
   * @param languageCode - BCP-47 code from the guest session (e.g. "ar", "es")
   */
  parse(query: string, languageCode: string): MultilingualParsedIntent {
    const q = query.trim().toLowerCase();

    // Primary: match against the guest's declared language
    const result = this.matchEntries(q, languageCode);
    if (result && result.confidence >= 0.8) {
      return { ...result, detectedLanguage: languageCode, normalizedQuery: query };
    }

    // Secondary: always run English matching alongside (catches bilingual queries)
    if (languageCode !== 'en') {
      const enResult = this.matchEntries(q, 'en');
      if (enResult && (!result || enResult.confidence > result.confidence)) {
        return { ...enResult, detectedLanguage: languageCode, normalizedQuery: query };
      }
    }

    // Fallback: return the best we found (even if low confidence)
    if (result) {
      return { ...result, detectedLanguage: languageCode, normalizedQuery: query };
    }

    return {
      intent: 'general',
      confidence: 0.5,
      detectedLanguage: languageCode,
      matchedSignals: [],
      normalizedQuery: query,
    };
  }

  private matchEntries(
    q: string,
    languageCode: string,
  ): Omit<MultilingualParsedIntent, 'detectedLanguage' | 'normalizedQuery'> | null {
    const entries = INTENT_DB[languageCode] ?? INTENT_DB['en'];
    let best: (typeof entries)[0] | null = null;
    let bestScore = 0;
    let matchedSignals: string[] = [];

    for (const entry of entries) {
      const hits = entry.keywords.filter((kw) => q.includes(kw));
      if (hits.length === 0) continue;

      // Score = base confidence × hit ratio (more matched keywords → higher score)
      const hitRatio = Math.min(hits.length / entry.keywords.length + 0.3, 1);
      const score = entry.confidence * hitRatio;

      if (score > bestScore) {
        bestScore = score;
        best = entry;
        matchedSignals = hits;
      }
    }

    if (!best) return null;

    return {
      intent: best.intent,
      confidence: Math.min(bestScore, 0.98),
      venueCategory: best.venueCategory,
      overpassAmenities: best.amenities,
      culturalContext: best.culturalContext,
      matchedSignals,
    };
  }
}
