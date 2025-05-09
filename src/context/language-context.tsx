
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { en, type LocaleStrings } from '@/locales/en';
import { vi } from '@/locales/vi';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: LocaleStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const locales: Record<Language, LocaleStrings> = { en, vi };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi'); // Default to Vietnamese

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('appLanguage') as Language | null : null;
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', lang);
    }
  };

  const translations = useMemo(() => locales[language] || locales['vi'], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
