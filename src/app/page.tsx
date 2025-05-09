
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Dices, Hash, Disc3, ArrowRight } from 'lucide-react';

const games = [
  {
    title: 'Coin Flipper',
    description: 'Toss virtual coins and see if luck is on your side. How many heads will you get?',
    href: '/coin-flipper',
    icon: Coins,
    dataAiHint: 'coin flip'
  },
  {
    title: 'Dice Roller',
    description: 'Roll one or more dice for your games or just for fun. What numbers will you roll?',
    href: '/dice-roller',
    icon: Dices,
    dataAiHint: 'dice game'
  },
  {
    title: 'Random Number Generator',
    description: 'Pick a number out of thin air! Define your range and let fate decide.',
    href: '/random-number',
    icon: Hash,
    dataAiHint: 'number abstract'
  },
  {
    title: 'Name Wheel',
    description: 'Spin the wheel to randomly select a name or item from your list. Perfect for giveaways!',
    href: '/name-wheel',
    icon: Disc3,
    dataAiHint: 'prize wheel'
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
          Welcome to <span className="text-primary">Random Funhouse</span>!
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore a collection of exciting random games. Perfect for making decisions, playing with friends, or just a bit of fun.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
                  Play Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
