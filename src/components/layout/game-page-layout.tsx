
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GamePageLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function GamePageLayout({ title, description, icon, children }: GamePageLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 text-primary shadow-md">
          {icon}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </header>
      <Card className="max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardContent className="p-6 md:p-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
