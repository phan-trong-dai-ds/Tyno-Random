
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Dices, Hash, Disc3, ArrowRight, Swords, Gift } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function HomePage() {
  const { translations } = useLanguage();

  const games = [
    {
      title: translations.coinFlipper as string,
      description: translations.coinFlipper_home_description as string,
      href: '/coin-flipper',
      icon: Coins,
      dataAiHint: 'coin flip'
    },
    {
      title: translations.diceRoller as string,
      description: translations.diceRoller_home_description as string,
      href: '/dice-roller',
      icon: Dices,
      dataAiHint: 'dice game'
    },
    {
      title: translations.randomNumber as string,
      description: translations.randomNumber_home_description as string,
      href: '/random-number',
      icon: Hash,
      dataAiHint: 'number abstract'
    },
    {
      title: translations.nameWheel as string,
      description: translations.nameWheel_home_description as string,
      href: '/name-wheel',
      icon: Disc3,
      dataAiHint: 'prize wheel'
    },
    {
      title: translations.rockPaperScissors as string,
      description: translations.rockPaperScissors_home_description as string,
      href: '/rock-paper-scissors',
      icon: Swords,
      dataAiHint: 'rock paper scissors'
    },
    {
      title: translations.blindBox as string, // Changed from blindBag
      description: translations.blindBox_home_description as string, // Changed from blindBag_home_description
      href: '/blind-box', // Changed from /blind-bag
      icon: Gift,
      dataAiHint: 'gift box surprise'
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
          {translations.welcomeMessage as string} <span className="text-primary">{translations.appTitle as string}</span>!
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {translations.homePageSubtitle as string}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <Card key={game.title} className="flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-lg overflow-hidden">
            <CardHeader className="items-center text-center p-6">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 inline-block shadow-sm">
                <game.icon className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl font-semibold">{game.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <CardDescription className="text-center text-base min-h-[3em]">
                {game.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50">
              <Button asChild className="w-full text-base py-3 group">
                <Link href={game.href}>
                  {translations.playNow as string} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
