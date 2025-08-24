import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'he', label: 'עברית', flag: '🇮🇱' },
    { code: 'ar', label: 'العربية', flag: '🇵🇸' }
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex bg-white rounded-full shadow-sm border border-gray-200 p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'he' | 'ar')}
            className={`
              px-3 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 text-sm
              ${language === lang.code 
                ? 'bg-luxury-gold text-white shadow-sm' 
                : 'hover:bg-luxury-cream text-luxury-charcoal'
              }
            `}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="font-body font-medium">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};