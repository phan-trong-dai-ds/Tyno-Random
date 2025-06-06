"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
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
        aria-label="Toggle theme" // Hardcoded English
        title="Toggle theme"      // Hardcoded English
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" /> {/* Default static icon */}
      </Button>
    );
  }

  // Once mounted, we can safely use the resolvedTheme
  const buttonLabel =
    resolvedTheme === "light"
      ? (translations.switchToDarkMode as string)
      : (translations.switchToLightMode as string);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      {resolvedTheme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
