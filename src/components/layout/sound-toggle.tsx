
'use client';
import * as React from 'react'; // Added for useEffect and useState
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/context/sound-context';
import { useLanguage } from '@/context/language-context';

export function SoundToggle() {
  const { isSoundEnabled, toggleSound } = useSound();
  const { translations } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a static placeholder during SSR and initial client render
    // to prevent hydration mismatch.
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Toggle sound" // Hardcoded English, will be updated by translations once mounted
        title="Toggle sound"      // Hardcoded English
      >
        <Volume2 className="h-[1.2rem] w-[1.2rem]" /> {/* Default static icon */}
      </Button>
    );
  }

  const buttonLabel = isSoundEnabled ? translations.muteSound as string : translations.unmuteSound as string;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      {isSoundEnabled ? <Volume2 className="h-[1.2rem] w-[1.2rem]" /> : <VolumeX className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
}
