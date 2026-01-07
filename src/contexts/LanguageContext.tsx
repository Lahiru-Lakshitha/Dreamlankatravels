"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, languages, LanguageCode, TranslationKeys } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationKeys;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, updateProfile, user } = useAuth();
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Initialize language from profile or localStorage
  useEffect(() => {
    if (profile?.preferred_language && translations[profile.preferred_language as LanguageCode]) {
      setLanguageState(profile.preferred_language as LanguageCode);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && translations[stored]) {
        setLanguageState(stored);
      }
    }
  }, [profile]);

  const setLanguage = useCallback(async (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    // Save to database if logged in
    if (user && updateProfile) {
      await updateProfile({ preferred_language: lang });
    }
  }, [user, updateProfile]);

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default values as fallback during initialization
    return {
      language: 'en' as LanguageCode,
      setLanguage: () => { },
      t: translations.en,
      languages,
    };
  }
  return context;
}
