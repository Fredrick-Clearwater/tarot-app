import { useState, useCallback, useRef } from 'react';
import type { TarotCard } from '../types';
import { createDeck, shuffleDeck, drawCards } from '../utils/deck';

interface UseDeckReturn {
  deck: TarotCard[];
  shuffled: TarotCard[];
  currentCards: { card: TarotCard; isReversed: boolean }[];
  isShuffling: boolean;
  shuffle: () => Promise<void>;
  draw: (count: number) => ReturnType<typeof drawCards>;
  reset: () => void;
}

export function useDeck(): UseDeckReturn {
  const [deck] = useState<TarotCard[]>(createDeck);
  const [shuffled, setShuffled] = useState<TarotCard[]>([]);
  const [currentCards, setCurrentCards] = useState<
    { card: TarotCard; isReversed: boolean }[]
  >([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const shuffle = useCallback(async () => {
    setIsShuffling(true);
    setCurrentCards([]);

    // Simulate shuffling time for animation
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => {
        shuffleTimer.current = setTimeout(resolve, 300);
      });
      setShuffled(shuffleDeck(deck));
    }

    setIsShuffling(false);
    setShuffled(shuffleDeck(deck));
  }, [deck]);

  const draw = useCallback(
    (count: number) => {
      const cards = drawCards(shuffled.length > 0 ? shuffled : shuffleDeck(deck), count);
      setCurrentCards(cards);
      // Remove drawn cards from shuffled
      setShuffled((prev) => prev.slice(count));
      return cards;
    },
    [shuffled, deck]
  );

  const reset = useCallback(() => {
    setShuffled([]);
    setCurrentCards([]);
    setIsShuffling(false);
    if (shuffleTimer.current) clearTimeout(shuffleTimer.current);
  }, []);

  return { deck, shuffled, currentCards, isShuffling, shuffle, draw, reset };
}
