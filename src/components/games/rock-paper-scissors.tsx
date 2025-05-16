
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, Users, RotateCcw, Grab } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

type Choice = 'rock' | 'paper' | 'scissors';
interface PlayerState {
  choice: Choice | null;
  revealed: boolean;
  animationKey: number;
}

const initialPlayerState: PlayerState = {
  choice: null,
  revealed: false,
  animationKey: 0,
};

const choices: Choice[] = ['rock', 'paper', 'scissors'];

const choiceIcons: Record<Choice, JSX.Element> = {
  rock: <Grab className="w-16 h-16 text-foreground" />,
  paper: <Hand className="w-16 h-16 text-foreground" />,
  scissors: <span className="text-6xl text-foreground" role="img" aria-label="victory hand">✌️</span>,
};

export function RockPaperScissors() {
  const { translations } = useLanguage();
  const [player1, setPlayer1] = useState<PlayerState>(initialPlayerState);
  const [player2, setPlayer2] = useState<PlayerState>(initialPlayerState);
  const [winner, setWinner] = useState<'player1' | 'player2' | 'draw' | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);

  const getRandomChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = useCallback((p1Choice: Choice, p2Choice: Choice) => {
    if (p1Choice === p2Choice) return 'draw';
    if (
      (p1Choice === 'rock' && p2Choice === 'scissors') ||
      (p1Choice === 'scissors' && p2Choice === 'paper') ||
      (p1Choice === 'paper' && p2Choice === 'rock')
    ) {
      return 'player1';
    }
    return 'player2';
  }, []);

  useEffect(() => {
    if (player1.revealed && player2.revealed && player1.choice && player2.choice) {
      setIsChoosing(false);
      const result = determineWinner(player1.choice, player2.choice);
      setWinner(result);
    } else if (player1.revealed || player2.revealed) {
        setIsChoosing(true);
    }
  }, [player1, player2, determineWinner]);

  const handlePlayerChoice = (player: 'player1' | 'player2') => {
    const randomChoice = getRandomChoice();
    if (player === 'player1') {
      setPlayer1(prev => ({ choice: randomChoice, revealed: true, animationKey: prev.animationKey + 1 }));
    } else {
      setPlayer2(prev => ({ choice: randomChoice, revealed: true, animationKey: prev.animationKey + 1 }));
    }
  };

  const handlePlayAgain = () => {
    setPlayer1(initialPlayerState);
    setPlayer2(prev => ({ ...initialPlayerState, animationKey: prev.animationKey +1 })); // Ensure different keys for player2 as well
    setWinner(null);
    setIsChoosing(false);
  };

  const getChoiceText = (choice: Choice | null): string => {
    if (!choice) return '';
    if (choice === 'rock') return translations.rock as string;
    if (choice === 'paper') return translations.paper as string;
    if (choice === 'scissors') return translations.scissors as string;
    return '';
  };

  const getWinnerText = () => {
    if (!winner) return null;
    if (winner === 'player1') return translations.player1Wins as string;
    if (winner === 'player2') return translations.player2Wins as string;
    return translations.draw as string;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player 1 Card */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              {translations.player1 as string}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[180px] flex flex-col items-center justify-center">
            {player1.revealed && player1.choice ? (
              <div key={player1.animationKey} className="animate-pop-in flex flex-col items-center">
                {choiceIcons[player1.choice]}
                <p className="mt-2 text-lg font-semibold">{getChoiceText(player1.choice)}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">{translations.makeYourChoice as string}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handlePlayerChoice('player1')}
              disabled={player1.revealed || (player1.revealed && player2.revealed)}
              className="w-full"
            >
              {player1.revealed ? translations.chosenButton as string : (translations.chooseButtonPlayer as (player: string) => string)(translations.player1 as string) }
            </Button>
          </CardFooter>
        </Card>

        {/* Player 2 Card */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              {translations.player2 as string}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[180px] flex flex-col items-center justify-center">
            {player2.revealed && player2.choice ? (
              <div key={player2.animationKey} className="animate-pop-in flex flex-col items-center">
                {choiceIcons[player2.choice]}
                <p className="mt-2 text-lg font-semibold">{getChoiceText(player2.choice)}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">{translations.makeYourChoice as string}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handlePlayerChoice('player2')}
              disabled={player2.revealed || (player1.revealed && player2.revealed)}
              className="w-full"
            >
             {player2.revealed ? translations.chosenButton as string : (translations.chooseButtonPlayer as (player: string) => string)(translations.player2 as string) }
            </Button>
          </CardFooter>
        </Card>
      </div>

      {winner && (
        <Card className="mt-6 text-center bg-primary/10 border-primary/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary animate-pop-in">{getWinnerText()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
                {player1.choice && player2.choice && winner !== 'draw' &&
                    (winner === 'player1' ?
                        `${getChoiceText(player1.choice)} ${translations.beatsText} ${getChoiceText(player2.choice)}` :
                        `${getChoiceText(player2.choice)} ${translations.beatsText} ${getChoiceText(player1.choice)}`
                    )
                }
            </p>
          </CardContent>
        </Card>
      )}
      
      {(player1.revealed && player2.revealed && winner) && (
         <Button onClick={handlePlayAgain} className="w-full mt-4">
            <RotateCcw className="mr-2 h-5 w-5" />
            {translations.playAgainButton as string}
        </Button>
      )}

      {isChoosing && !winner && player1.revealed && !player2.revealed && (
        <p className="text-center text-muted-foreground mt-4 animate-pulse">{(translations.waitingForPlayer as (player: string) => string)(translations.player2 as string)}</p>
      )}
      {isChoosing && !winner && player2.revealed && !player1.revealed && (
        <p className="text-center text-muted-foreground mt-4 animate-pulse">{(translations.waitingForPlayer as (player: string) => string)(translations.player1 as string)}</p>
      )}

    </div>
  );
}

