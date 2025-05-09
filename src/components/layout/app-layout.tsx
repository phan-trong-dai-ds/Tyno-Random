
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Dice5, Home, Coins, Dices, Hash, Disc3, Github } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "./language-switcher";
import { motion, AnimatePresence } from 'framer-motion';

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { translations } = useLanguage();

  const navItems = [
    { href: "/", label: translations.home as string, icon: Home },
    { href: "/coin-flipper", label: translations.coinFlipper as string, icon: Coins },
    { href: "/dice-roller", label: translations.diceRoller as string, icon: Dices },
    { href: "/random-number", label: translations.randomNumber as string, icon: Hash },
    { href: "/name-wheel", label: translations.nameWheel as string, icon: Disc3 },
  ];

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
            <Dice5 className="w-7 h-7 text-sidebar-primary" />
            <span>{translations.appTitle as string}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 flex items-center justify-start"> {/* Removed justify-between */}
           <Button variant="ghost" className="flex-grow justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent" asChild>
            <Link href="https://github.com/firebase/studio-examples/tree/main/random-funhouse-nextjs" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              <span>{translations.viewSource as string}</span>
            </Link>
          </Button>
          {/* LanguageSwitcher removed from here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
          {/* Left section of header */}
          <div className="flex items-center gap-2">
            <SidebarTrigger aria-label={translations.toggleSidebar as string} className="md:hidden" /> {/* Only on mobile */}
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Dice5 className="w-6 h-6 text-primary" />
              <span className="hidden md:inline">{translations.appTitle as string}</span>
              <span className="sr-only md:hidden">{translations.appTitle as string}</span>
            </Link>
          </div>

          {/* Right section of header */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 overflow-y-auto" 
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
