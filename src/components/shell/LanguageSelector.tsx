'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { Language } from '@/lib/i18n/types';

export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-subtleBorder bg-surface hover:bg-secondaryBg text-xs font-semibold text-textMain transition-all shadow-sm"
        title="Change Platform Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline font-sans">{currentLang.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-textMuted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-surface border border-subtleBorder rounded-card shadow-card z-50 overflow-hidden py-1 animate-in fade-in-50">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-textMuted tracking-wider border-b border-subtleBorder/60">
            Language
          </div>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                language === lang.code
                  ? 'bg-primary-light text-primary font-bold'
                  : 'text-textSecondary hover:text-textMain hover:bg-secondaryBg'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
