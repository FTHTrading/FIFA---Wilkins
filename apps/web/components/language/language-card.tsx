'use client';

import Link from 'next/link';
import type { Language } from '@wilkins/types';
import { cn } from '@wilkins/ui';

interface LanguageCardProps {
  language: Language;
}

export function LanguageCard({ language }: LanguageCardProps) {
  function handleClick() {
    document.cookie = `wilkins_lang=${language.code}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <Link
      href={`/event?lang=${language.code}`}
      onClick={handleClick}
      className={cn(
        'group flex flex-col items-center gap-2 rounded-xl border border-brand-border',
        'bg-brand-surface p-4 transition-all duration-200',
        'hover:border-brand-gold hover:bg-brand-slate hover:shadow-brand',
        'focus-visible:border-brand-electric focus-visible:ring-2 focus-visible:ring-brand-electric',
      )}
      lang={language.code}
      dir={language.rtl ? 'rtl' : 'ltr'}
    >
      <span className="text-3xl" role="img" aria-label={language.name}>
        {language.flagEmoji}
      </span>
      <span className="font-display text-sm font-semibold text-brand-text group-hover:text-brand-gold">
        {language.nativeName}
      </span>
      <span className="text-xs text-brand-muted">{language.name}</span>
    </Link>
  );
}
