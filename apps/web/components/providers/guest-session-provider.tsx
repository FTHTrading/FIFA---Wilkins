'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { GuestSession } from '@wilkins/types';
import { nanoid } from '@wilkins/lib';

interface GuestSessionContextValue {
  session: GuestSession | null;
  languageCode: string;
  setLanguage: (code: string) => void;
}

const GuestSessionContext = createContext<GuestSessionContextValue>({
  session: null,
  languageCode: 'en',
  setLanguage: () => {},
});

export function GuestSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [languageCode, setLanguageCode] = useState('en');

  useEffect(() => {
    // Restore or create session
    const stored = sessionStorage.getItem('wilkins_guest_session');
    if (stored) {
      const parsed: GuestSession = JSON.parse(stored);
      setSession(parsed);
      setLanguageCode(parsed.languageCode);
    } else {
      // Read lang from URL if present
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang') ?? 'en';
      const newSession: GuestSession = {
        sessionId: nanoid(16),
        languageCode: langParam,
        startedAt: new Date().toISOString(),
      };
      sessionStorage.setItem('wilkins_guest_session', JSON.stringify(newSession));
      setSession(newSession);
      setLanguageCode(langParam);
      document.cookie = `wilkins_lang=${langParam}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  function setLanguage(code: string) {
    setLanguageCode(code);
    document.cookie = `wilkins_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    if (session) {
      const updated = { ...session, languageCode: code };
      setSession(updated);
      sessionStorage.setItem('wilkins_guest_session', JSON.stringify(updated));
    }
  }

  return (
    <GuestSessionContext.Provider value={{ session, languageCode, setLanguage }}>
      {children}
    </GuestSessionContext.Provider>
  );
}

export function useGuestSession() {
  return useContext(GuestSessionContext);
}
