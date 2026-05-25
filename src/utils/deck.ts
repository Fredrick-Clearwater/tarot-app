import type { TarotCard } from '../types';
import tarotCards from '../data/tarot-cards.json';

const deck: TarotCard[] = tarotCards as TarotCard[];

export function createDeck(): TarotCard[] {
  return [...deck];
}

export function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(
  shuffled: TarotCard[],
  count: number
): { card: TarotCard; isReversed: boolean }[] {
  return shuffled.slice(0, count).map((card) => ({
    card,
    isReversed: Math.random() < 0.5,
  }));
}

export function getCardById(id: number): TarotCard | undefined {
  return deck.find((c) => c.id === id);
}
