import type { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@wilkins/types';
import { LanguageCard } from '@/components/language/language-card';

export const metadata: Metadata = {
  title: 'Select Your Language — Wilkins Media',
};

export default function SelectLanguagePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-gradient px-4 py-12">
      {/* Wilkins Media wordmark */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold">
          Wilkins Media
        </p>
        <h1 className="font-display text-3xl font-bold text-brand-text sm:text-4xl">
          Global Guest OS
        </h1>
        <p className="mt-3 text-sm text-brand-muted">
          Select your language to begin · Selecciona tu idioma · اختر لغتك
        </p>
      </div>

      {/* Language grid */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SUPPORTED_LANGUAGES.filter((l) => l.isActive).map((lang) => (
            <LanguageCard key={lang.code} language={lang} />
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-brand-muted">
        Powered by{' '}
        <span className="text-brand-gold font-medium">Wilkins Media</span>
      </p>
    </main>
  );
}
