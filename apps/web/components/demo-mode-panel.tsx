'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Play, X, Globe, Zap, ChevronDown, RotateCcw, Pause } from 'lucide-react';
import { useGuestSession } from '@/components/providers/guest-session-provider';
import { useConciergeStore } from '@/lib/store';

// ─── Vertical Demo Scenarios ──────────────────────────────────────────────────

interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  /** Per-language query; falls back to 'en' */
  queries: Record<string, string>;
  landingPage: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'food-from-home',
    title: 'Food From Home',
    subtitle: 'Culturally relevant dining near the stadium',
    icon: '🥙',
    queries: {
      ar: 'أحتاج طعام حلال قرب الملعب',
      es: 'comida mexicana cerca del estadio',
      pt: 'comida brasileira em Atlanta',
      fr: 'restaurant français près du stade',
      ja: 'スタジアム近くの日本食',
      ko: '경기장 근처 한식당',
      'zh-CN': '体育场附近的中餐馆',
      de: 'deutsches Restaurant in der Nähe des Stadions',
      en: 'halal food near the stadium',
    },
    landingPage: '/event/map',
  },
  {
    id: 'exit-transport',
    title: 'Exit + Transportation',
    subtitle: 'Post-match exit with rideshare sponsor injection',
    icon: '🚗',
    queries: {
      ar: 'أحتاج مواصلات إلى الفندق',
      es: 'cómo salir del estadio en transporte',
      pt: 'como chegar ao aeroporto',
      fr: 'comment rentrer à mon hôtel en transport',
      ja: 'ホテルへの交通手段',
      ko: '호텔로 가는 교통편',
      'zh-CN': '怎么去机场',
      de: 'Wie komme ich zum Hotel',
      en: 'How do I exit the stadium and get a ride to my hotel?',
    },
    landingPage: '/event/map',
  },
  {
    id: 'emergency-help',
    title: 'Emergency Help',
    subtitle: 'Lost child, hospital, police — translated instantly',
    icon: '🚨',
    queries: {
      ar: 'فقدت طفلي بالقرب من البوابة ب',
      es: 'necesito un hospital cerca, es una emergencia',
      pt: 'meu filho se perdeu perto do portão A',
      fr: 'mon enfant est perdu, aidez-moi',
      ja: '子供が迷子になりました、助けてください',
      ko: '아이를 잃어버렸어요, 도와주세요',
      'zh-CN': '我的孩子走丢了，请帮忙',
      de: 'Mein Kind ist verloren gegangen, bitte helfen Sie',
      en: 'I lost my child near Gate B, please help',
    },
    landingPage: '/event/emergency',
  },
  {
    id: 'sponsor-rewards',
    title: 'Sponsor & Rewards',
    subtitle: 'Badges, scavenger hunts, coupons — gamified engagement',
    icon: '🏆',
    queries: {
      ar: 'ما هي التحديات والمكافآت المتاحة؟',
      es: '¿qué desafíos y recompensas hay disponibles?',
      pt: 'quais desafios e recompensas estão disponíveis?',
      fr: 'quels défis et récompenses sont disponibles ?',
      ja: 'チャレンジとリワードは何がありますか？',
      ko: '어떤 챌린지와 보상이 있나요?',
      'zh-CN': '有哪些挑战和奖励？',
      de: 'Welche Challenges und Belohnungen gibt es?',
      en: 'What challenges and rewards are available?',
    },
    landingPage: '/event/rewards',
  },
  {
    id: 'stadium-navigation',
    title: 'Stadium Navigator',
    subtitle: 'Find gates, restrooms, first aid — any language',
    icon: '🗺️',
    queries: {
      ar: 'أين أقرب دورة مياه؟',
      es: '¿dónde está el baño más cercano?',
      pt: 'onde fica o banheiro mais próximo?',
      fr: 'où sont les toilettes les plus proches ?',
      ja: '最寄りのトイレはどこですか？',
      ko: '가장 가까운 화장실은 어디인가요?',
      'zh-CN': '最近的洗手间在哪里？',
      de: 'Wo ist die nächste Toilette?',
      en: 'Where is the nearest restroom?',
    },
    landingPage: '/event/map',
  },
];

const LANGUAGES = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Spanish', flag: '🇲🇽' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const;

const VENUE_ID = 'mercedes-benz-stadium';

export function DemoModePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [autoStep, setAutoStep] = useState(0);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setLanguage } = useGuestSession();
  const searchFn = useConciergeStore((s) => s.search);
  const router = useRouter();

  // Auto-play sequence: cycle through all scenarios with different languages
  const AUTO_SEQUENCE = [
    { lang: 'ar', scenarioIdx: 0 }, // Arabic — Food From Home
    { lang: 'es', scenarioIdx: 1 }, // Spanish — Exit + Transport
    { lang: 'ja', scenarioIdx: 4 }, // Japanese — Stadium Navigator
    { lang: 'fr', scenarioIdx: 2 }, // French — Emergency
    { lang: 'ko', scenarioIdx: 3 }, // Korean — Sponsor Rewards
  ];

  const stopAutoPlay = useCallback(() => {
    setAutoPlaying(false);
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const runAutoStep = useCallback((step: number) => {
    if (step >= AUTO_SEQUENCE.length) {
      stopAutoPlay();
      return;
    }

    const entry = AUTO_SEQUENCE[step];
    if (!entry) { stopAutoPlay(); return; }
    const { lang, scenarioIdx } = entry;
    const scenario = DEMO_SCENARIOS[scenarioIdx];
    if (!scenario) { stopAutoPlay(); return; }
    const query = scenario.queries[lang] ?? scenario.queries['en'] ?? '';

    setSelectedLang(lang);
    setSelectedScenario(scenario.id);
    setAutoStep(step);

    // Set language and trigger search
    setLanguage(lang);
    searchFn(query, lang, VENUE_ID).then(() => {
      router.push(scenario.landingPage);
      // Move to next step after 6 seconds
      autoTimerRef.current = setTimeout(() => runAutoStep(step + 1), 6000);
    });
  }, [searchFn, router, setLanguage, stopAutoPlay]);

  function startAutoPlay() {
    setAutoPlaying(true);
    runAutoStep(0);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, []);

  function handleLaunch() {
    const lang = selectedLang ?? 'ar';
    const scenario = DEMO_SCENARIOS.find((s) => s.id === selectedScenario) ?? DEMO_SCENARIOS[0]!;
    const query = scenario.queries[lang] ?? scenario.queries['en'] ?? '';

    setLanguage(lang);
    searchFn(query, lang, VENUE_ID).then(() => {
      router.push(scenario.landingPage);
    });

    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-16 right-3 z-50 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xl shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 transition-all animate-pulse hover:animate-none"
      >
        <Play className="h-3 w-3" />
        Demo
      </button>
    );
  }

  return (
    <div className="fixed top-14 right-3 z-50 w-72 rounded-2xl border border-fuchsia-500/40 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-fuchsia-500/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-fuchsia-400" />
          <span className="text-sm font-bold text-white">Demo Mode</span>
        </div>
        <div className="flex items-center gap-1">
          {autoPlaying ? (
            <button type="button" onClick={stopAutoPlay} className="flex items-center gap-1 rounded-lg bg-amber-600/20 px-2 py-1 text-xs text-amber-400 hover:bg-amber-600/30">
              <Pause className="h-3 w-3" />
              Stop
            </button>
          ) : (
            <button type="button" onClick={startAutoPlay} className="flex items-center gap-1 rounded-lg bg-fuchsia-600/20 px-2 py-1 text-xs text-fuchsia-400 hover:bg-fuchsia-600/30">
              <RotateCcw className="h-3 w-3" />
              Auto-Play
            </button>
          )}
          <button type="button" onClick={() => { stopAutoPlay(); setIsOpen(false); }} className="text-slate-500 hover:text-white ml-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Auto-play status */}
      {autoPlaying && (
        <div className="mx-4 mt-3 rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/30 px-3 py-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" />
            <span className="text-fuchsia-300 font-medium">
              Auto-playing {autoStep + 1}/{AUTO_SEQUENCE.length} — {LANGUAGES.find((l) => l.code === AUTO_SEQUENCE[autoStep]?.lang)?.flag} {AUTO_SEQUENCE[autoStep] ? DEMO_SCENARIOS[AUTO_SEQUENCE[autoStep].scenarioIdx]?.title : ''}
            </span>
          </div>
          <div className="mt-1.5 flex gap-1">
            {AUTO_SEQUENCE.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i < autoStep ? 'bg-fuchsia-400' : i === autoStep ? 'bg-fuchsia-400 animate-pulse' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Language picker */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Globe className="h-3 w-3" /> Choose language
        </p>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLang(lang.code)}
              className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                selectedLang === lang.code
                  ? 'bg-fuchsia-600 text-white ring-1 ring-fuchsia-400'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {lang.flag} {lang.code}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario picker */}
      <div className="px-4 pt-2 pb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <ChevronDown className="h-3 w-3" /> Choose scenario
        </p>
        <div className="space-y-1.5">
          {DEMO_SCENARIOS.map((scenario) => {
            const lang = selectedLang ?? 'ar';
            const query = scenario.queries[lang] ?? scenario.queries['en'];
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenario(scenario.id)}
                className={`w-full rounded-xl p-3 text-left transition-all ${
                  selectedScenario === scenario.id
                    ? 'bg-fuchsia-600/20 border border-fuchsia-500/50 ring-1 ring-fuchsia-500/30'
                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{scenario.icon}</span>
                  <span className="text-sm font-semibold text-white">{scenario.title}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{scenario.subtitle}</p>
                <p className="text-xs text-fuchsia-300/80 font-mono truncate" dir="auto">
                  "{query}"
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleLaunch}
          disabled={!selectedLang && !selectedScenario}
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:from-fuchsia-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          Launch Demo
        </button>
        <p className="text-center text-[10px] text-slate-600 mt-1.5">
          Sets language → pre-fills query → navigates to result
        </p>
      </div>
    </div>
  );
}
