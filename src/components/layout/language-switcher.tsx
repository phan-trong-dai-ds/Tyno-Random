
'use client';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { USFlagIcon } from '@/components/icons/us-flag-icon';
import { VietnamFlagIcon } from '@/components/icons/vietnam-flag-icon';

export function LanguageSwitcher() {
  const { language, setLanguage, translations } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  const buttonLabel = language === 'en' ? translations.switchToVietnamese as string : translations.switchToEnglish as string;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      {language === 'en' ? <VietnamFlagIcon /> : <USFlagIcon />}
    </Button>
  );
}

