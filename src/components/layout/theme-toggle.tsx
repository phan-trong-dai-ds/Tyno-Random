
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { translations } = useLanguage();

  const currentTheme = theme === "system" ? "system" : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  const buttonLabel =
    currentTheme === "light"
      ? (translations.switchToDarkMode as string)
      : (translations.switchToLightMode as string);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      {currentTheme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
