'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, TranslationSchema } from './types';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { mr } from './translations/mr';

const TRANSLATIONS: Record<Language, TranslationSchema> = { en, hi, mr };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  availableLanguages: { code: Language; label: string; flag: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'bridge_preferred_language';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Language;
        if (stored && (stored === 'en' || stored === 'hi' || stored === 'mr')) {
          setLanguageState(stored);
        }
      } catch (e) {
        console.error('Failed to read preferred language', e);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.error('Failed to save preferred language', e);
      }
    }
  };

  const t = useMemo(() => TRANSLATIONS[language] || en, [language]);

  const availableLanguages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
