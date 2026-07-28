
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundPath: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabledState] = useState<boolean>(true); // Default to sound on

  useEffect(() => {
    const savedSoundPreference = typeof window !== 'undefined' ? localStorage.getItem('appSoundEnabled') : null;
    if (savedSoundPreference !== null) {
      setIsSoundEnabledState(savedSoundPreference === 'true');
    }
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabledState(prev => {
      const newState = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('appSoundEnabled', String(newState));
      }
      return newState;
    });
  }, []);

  const playSound = useCallback((soundPath: string) => {
    if (isSoundEnabled) {
      const basePath = '';
      const fullPath = `${basePath}${soundPath.startsWith('/') ? '' : '/'}${soundPath}`;
      const audio = new Audio(fullPath);
      audio.play().catch(error => {
        console.error(`Error playing sound: ${fullPath}`, error);
      });
    }
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
