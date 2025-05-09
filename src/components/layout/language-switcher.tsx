
'use client';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

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
      className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
    >
      <Languages className="h-5 w-5" />
    </Button>
  );
}
