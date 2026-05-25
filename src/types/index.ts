export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  arcana: 'major' | 'minor';
  suit: Suit | null;
  number: number;
  keywords: string[];
  meanings: {
    upright: DimensionMeanings;
    reversed: DimensionMeanings;
  };
  description: string;
}

export interface DimensionMeanings {
  general: string;
  love: string;
  career: string;
  health: string;
}

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: string;
  positionIndex: number;
  isRevealed: boolean;
}

export type SpreadType = 'single' | 'three' | 'celtic-cross';

export interface SpreadConfig {
  type: SpreadType;
  name: string;
  nameZh: string;
  description: string;
  cardCount: number;
  positions: string[];
  layoutClass: string;
}

export interface ReadingRecord {
  id: string;
  date: string;
  spreadType: SpreadType;
  question: string;
  cards: DrawnCard[];
}

export type AppPage = 'home' | 'history' | 'settings';

export type ReadingPhase =
  | 'idle'
  | 'selecting-spread'
  | 'shuffling'
  | 'drawing'
  | 'revealing'
  | 'reading';
