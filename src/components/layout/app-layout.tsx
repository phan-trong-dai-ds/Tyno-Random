
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

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/coin-flipper", label: "Coin Flipper", icon: Coins },
  { href: "/dice-roller", label: "Dice Roller", icon: Dices },
  { href: "/random-number", label: "Random Number", icon: Hash },
  { href: "/name-wheel", label: "Name Wheel", icon: Disc3 },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
            <Dice5 className="w-7 h-7 text-sidebar-primary" />
            <span>Random Funhouse</span>
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
        <SidebarFooter className="p-4">
           <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent" asChild>
            <Link href="https://github.com/firebase/studio-examples/tree/main/random-funhouse-nextjs" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              View Source
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Dice5 className="w-6 h-6 text-primary" />
            <span className="sr-only">Random Funhouse</span>
          </Link>
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
