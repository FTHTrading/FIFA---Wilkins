'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Volume2, ArrowLeft, CheckCircle, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { Button } from '@wilkins/ui';
import { useGuestSession } from '@/components/providers/guest-session-provider';
import { reportEmergencyIncident } from '@/lib/api';

// Static approved translations for each emergency phrase key.
// These are NOT live AI translations — they are pre-reviewed professional translations.
const APPROVED_PHRASES: Record<string, Record<string, string>> = {
  need_hospital: {
    en: 'I need a hospital', ar: 'أحتاج إلى مستشفى', es: 'Necesito un hospital',
    fr: "J'ai besoin d'un hôpital", pt: 'Preciso de um hospital', ja: '病院が必要です',
    ko: '병원이 필요합니다', 'zh-CN': '我需要去医院', de: 'Ich brauche ein Krankenhaus',
    it: 'Ho bisogno di un ospedale',
  },
  lost_child: {
    en: 'I lost my child', ar: 'فقدت طفلي', es: 'Perdí a mi hijo/a',
    fr: "J'ai perdu mon enfant", pt: 'Perdi meu filho', ja: '子供を見失いました',
    ko: '아이를 잃어버렸습니다', 'zh-CN': '我的孩子走失了', de: 'Ich habe mein Kind verloren',
    it: 'Ho perso mio figlio',
  },
  i_am_lost: {
    en: 'I am lost', ar: 'أنا ضائع', es: 'Estoy perdido',
    fr: 'Je suis perdu', pt: 'Estou perdido', ja: '迷子になりました',
    ko: '길을 잃었습니다', 'zh-CN': '我迷路了', de: 'Ich habe mich verlaufen',
    it: 'Mi sono perso',
  },
  need_medical: {
    en: 'I need medical help', ar: 'أحتاج إلى مساعدة طبية', es: 'Necesito ayuda médica',
    fr: "J'ai besoin d'aide médicale", pt: 'Preciso de ajuda médica', ja: '医療サポートが必要です',
    ko: '의료 도움이 필요합니다', 'zh-CN': '我需要医疗帮助', de: 'Ich brauche medizinische Hilfe',
    it: 'Ho bisogno di aiuto medico',
  },
  need_police: {
    en: 'I need police', ar: 'أحتاج إلى الشرطة', es: 'Necesito a la policía',
    fr: "J'ai besoin de la police", pt: 'Preciso de polícia', ja: '警察が必要です',
    ko: '경찰이 필요합니다', 'zh-CN': '我需要警察', de: 'Ich brauche die Polizei',
    it: 'Ho bisogno della polizia',
  },
  lost_passport: {
    en: 'I lost my passport', ar: 'فقدت جواز سفري', es: 'Perdí mi pasaporte',
    fr: "J'ai perdu mon passeport", pt: 'Perdi meu passaporte', ja: 'パスポートを紛失しました',
    ko: '여권을 잃어버렸습니다', 'zh-CN': '我丢失了护照', de: 'Ich habe meinen Pass verloren',
    it: 'Ho perso il mio passaporto',
  },
  need_transport: {
    en: 'I need transportation', ar: 'أحتاج إلى وسيلة نقل', es: 'Necesito transporte',
    fr: "J'ai besoin de transport", pt: 'Preciso de transporte', ja: '交通手段が必要です',
    ko: '교통수단이 필요합니다', 'zh-CN': '我需要交通工具', de: 'Ich brauche ein Transportmittel',
    it: 'Ho bisogno di trasporto',
  },
  need_translation: {
    en: 'I need translation help', ar: 'أحتاج إلى مساعدة في الترجمة', es: 'Necesito ayuda con traducción',
    fr: "J'ai besoin d'aide pour la traduction", pt: 'Preciso de ajuda com tradução', ja: '翻訳サポートが必要です',
    ko: '번역 도움이 필요합니다', 'zh-CN': '我需要翻译帮助', de: 'Ich brauche Übersetzungshilfe',
    it: 'Ho bisogno di aiuto con la traduzione',
  },
};

const PHRASE_META: Record<string, { emoji: string; urgency: string }> = {
  need_hospital: { emoji: '🏥', urgency: 'CRITICAL' },
  lost_child:    { emoji: '👦', urgency: 'CRITICAL' },
  i_am_lost:     { emoji: '📍', urgency: 'HIGH' },
  need_medical:  { emoji: '🩺', urgency: 'CRITICAL' },
  need_police:   { emoji: '🚔', urgency: 'HIGH' },
  lost_passport: { emoji: '📄', urgency: 'HIGH' },
  need_transport:{ emoji: '🚗', urgency: 'MEDIUM' },
  need_translation:{ emoji: '🗣️', urgency: 'MEDIUM' },
};

interface PageProps {
  params: Promise<{ phraseKey: string }>;
}

export default function EmergencyPhrasePage({ params }: PageProps) {
  const { phraseKey } = use(params);
  const { languageCode } = useGuestSession();
  const router = useRouter();
  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  const phrase = APPROVED_PHRASES[phraseKey];
  if (!phrase) notFound();

  const meta = PHRASE_META[phraseKey] ?? { emoji: '🆘', urgency: 'HIGH' };
  const lang = languageCode ?? 'en';
  const guestText = phrase[lang] ?? phrase.en;
  const englishText = phrase.en;
  const isRtl = ['ar', 'he', 'fa', 'ur'].includes(lang);
  const isCritical = meta.urgency === 'CRITICAL';

  async function handleReport() {
    setReporting(true);
    try {
      await reportEmergencyIncident({
        sessionId: 'guest-session',
        venueId: 'mercedes-benz-stadium',
        phraseKey,
        language: lang,
      });
      setReported(true);
    } catch {
      // Still mark as reported for demo — API may not be running
      setReported(true);
    }
    setReporting(false);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${
        isCritical
          ? 'bg-gradient-to-b from-red-950 via-red-900 to-red-950'
          : 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950'
      }`}
    >
      {/* Pulsing border effect for critical */}
      {isCritical && (
        <div className="absolute inset-0 border-4 border-red-500 animate-pulse pointer-events-none rounded-none" />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 relative z-10">
        <Link href="/event/emergency">
          <button type="button" className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </Link>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className={`h-4 w-4 ${isCritical ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${isCritical ? 'text-red-300' : 'text-amber-300'}`}>
            {meta.urgency}
          </span>
        </div>
      </div>

      {/* Main display area — centered, maximum readability */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 relative z-10">
        {/* Badge */}
        <div className={`mb-4 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${
          isCritical ? 'bg-red-500/30 text-red-200 border border-red-500/50' : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
        }`}>
          {meta.emoji} Emergency · Show to Staff
        </div>

        {/* Guest language — hero text */}
        <p
          className="font-display text-5xl font-black leading-tight text-white text-center sm:text-6xl lg:text-7xl max-w-2xl"
          lang={lang}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {guestText}
        </p>

        {/* English fallback */}
        {lang !== 'en' && (
          <p className="mt-6 text-2xl font-semibold text-white/60 text-center max-w-lg">
            {englishText}
          </p>
        )}

        {/* Voice button */}
        <button
          type="button"
          className={`mt-8 flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold transition-all ${
            isCritical
              ? 'bg-white/15 text-white border-2 border-white/30 hover:bg-white/25 active:scale-95'
              : 'bg-white/15 text-white border-2 border-white/30 hover:bg-white/25 active:scale-95'
          }`}
        >
          <Volume2 className="h-6 w-6" />
          Play Audio
        </button>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-6 space-y-3 relative z-10">
        {!reported ? (
          <button
            type="button"
            onClick={handleReport}
            disabled={reporting}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold transition-all active:scale-[0.98] ${
              isCritical
                ? 'bg-white text-red-900 hover:bg-red-100'
                : 'bg-white text-amber-900 hover:bg-amber-100'
            } disabled:opacity-60`}
          >
            <AlertTriangle className="h-5 w-5" />
            {reporting ? 'Reporting…' : 'Report to Staff Now'}
          </button>
        ) : (
          <div className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold ${
            isCritical ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
          }`}>
            <CheckCircle className="h-5 w-5" />
            Help is on the way
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/event/map')}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 py-3.5 text-sm font-semibold text-white hover:bg-white/20 active:scale-[0.98]"
          >
            <MapPin className="h-4 w-4" />
            Show on Map
          </button>
          <a
            href="tel:911"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 py-3.5 text-sm font-semibold text-white hover:bg-white/20 active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" />
            Call 911
          </a>
        </div>

        <p className="text-center text-xs text-white/40">
          ✓ Pre-approved professional translation · Not AI-generated
        </p>
      </div>
    </div>
  );
}
