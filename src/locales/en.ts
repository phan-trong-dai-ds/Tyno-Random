
// Define the structure of a single translation entry which can be string or function
type TranslationValue = string | ((...args: any[]) => string);

// Define LocaleStrings placeholder, it will be inferred from the 'en' object itself
export type LocaleStrings = Record<string, TranslationValue>;

export const en = {
  // AppLayout & General
  appTitle: "Tyno Random",
  appDescription: "A collection of fun random games to pass the time.",
  home: "Home",
  coinFlipper: "Coin Flipper",
  diceRoller: "Dice Roller",
  randomNumber: "Random Number",
  nameWheel: "Name Wheel",
  rockPaperScissors: "Rock Paper Scissors",
  viewSource: "View Source",
  toggleSidebar: "Toggle Sidebar",
  switchToEnglish: "Switch to English",
  switchToVietnamese: "Chuyển sang Tiếng Việt",
  navigationMenu: "Navigation Menu", // For sr-only title in Sheet
  toggleTheme: "Toggle theme",
  switchToDarkMode: "Switch to dark mode",
  switchToLightMode: "Switch to light mode",

  // HomePage
  welcomeMessage: "Welcome to",
  homePageSubtitle: "Explore a collection of exciting random games. Perfect for making decisions, playing with friends, or just a bit of fun.",
  coinFlipper_home_description: "Toss virtual coins and see if luck is on your side. How many heads will you get?",
  diceRoller_home_description: "Roll one or more dice for your games or just for fun. What numbers will you roll?",
  randomNumber_home_description: "Pick a number out of thin air! Define your range and let fate decide.",
  nameWheel_home_description: "Spin the wheel to randomly select a name or item from your list. Perfect for giveaways!",
  rockPaperScissors_home_description: "A classic game of choices. Rock, Paper, or Scissors - who will win?",
  playNow: "Play Now",

  // Coin Flipper Page & Component
  coinFlipper_page_title: "Coin Flipper",
  coinFlipper_page_description: "Toss one or more virtual coins. Will fortune favor you with heads or tails? Adjust the number of coins and see the random outcomes!",
  numCoinsLabel: "Number of Coins (1-20)",
  flipCoinsButton: "Flip Coins",
  flippingButton: "Flipping...",
  resultsTitle: "Results",
  heads: "Heads",
  tails: "Tails",
  totalHeads: "Total Heads",
  totalTails: "Total Tails",
  numCoinsValidationAlert: "Please enter a number of coins between 1 and 20.",

  // Dice Roller Page & Component
  diceRoller_page_title: "Dice Roller",
  diceRoller_page_description: "Roll one or more standard 6-sided dice. Great for board games, RPGs, or when you just need a random number from 1 to 6.",
  numDiceLabel: "Number of Dice (1-20)",
  rollDiceButton: "Roll Dice",
  rollingButton: "Rolling...",
  total: "Total",
  numDiceValidationAlert: "Please enter a number of dice between 1 and 20.",

  // Random Number Page & Component
  randomNumber_page_title: "Random Number Generator",
  randomNumber_page_description: "Need a random number? Specify your minimum and maximum values, and let us pick one for you. Simple, quick, and unbiased.",
  minValLabel: "Minimum Value",
  maxValLabel: "Maximum Value",
  generateNumberButton: "Generate Number",
  generatingButton: "Generating...",
  generatedNumberTitle: "Generated Number",
  minMaxValidationAlert: "Minimum value must be less than maximum value.",

  // Name Wheel Page & Component
  nameWheel_page_title: "Name Wheel",
  nameWheel_page_description: "Enter a list of names or items, then spin the wheel to randomly select one. Perfect for making choices, giveaways, or classroom activities!",
  enterNamesLabel: "Enter Names (one per line)",
  shuffleNamesButtonLabel: "Shuffle names",
  sortNamesButtonLabel: "Sort names",
  namesPlaceholder: "Alice\nBob\nCharlie...",
  namesEnteredSuffix: (count: number) => `${count} name(s) entered.`,
  addNamesPrompt: "Add names to see the wheel!",
  spinWheelButton: "Spin the Wheel!",
  spinningButton: "Spinning...",
  noNamesToSpinErrorTitle: "No names to spin!",
  noNamesToSpinErrorDescription: "Please add some names to the list first.",
  winnerAlertTitle: "Winner!",
  removeWinnerButton: "Remove",
  closeWinnerAlertButton: "Close",
  winnerRemovedToastTitle: "Winner Removed",
  winnerRemovedToastDescription: (name: string) => `${name} has been removed from the list.`,

  // Rock Paper Scissors Page & Component
  rockPaperScissors_page_title: "Rock Paper Scissors",
  rockPaperScissors_page_description: "Play Rock Paper Scissors. Each player's move is randomized. Who will win this round?",
  player1: "Player 1",
  player2: "Player 2",
  chooseButtonPlayer: (player: string) => `${player}: Make Move!`,
  chosenButton: "Move Made",
  choosingButton: "Choosing...",
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
  player1Wins: "Player 1 Wins!",
  player2Wins: "Player 2 Wins!",
  draw: "It's a Draw!",
  playAgainButton: "Play Again",
  waitingForPlayer: (player: string) => `Waiting for ${player}...`,
  makeYourChoice: "Make your move!",
  beatsText: "beats",
};

// Infer LocaleStrings from the 'en' object to ensure all keys are covered
export type ActualLocaleStrings = typeof en;
