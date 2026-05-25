import { useState, useCallback } from 'react';
import type { ReadingPhase, SpreadType, DrawnCard } from '../types';
import { SPREADS } from '../constants/spreads';

interface ReadingState {
  phase: ReadingPhase;
  spreadType: SpreadType | null;
  cards: DrawnCard[];
  question: string;
}

interface UseReadingReturn {
  phase: ReadingPhase;
  spreadType: SpreadType | null;
  cards: DrawnCard[];
  question: string;
  selectSpread: (type: SpreadType) => void;
  setQuestion: (q: string) => void;
  startShuffling: () => void;
  setCards: (cards: DrawnCard[]) => void;
  revealCard: (index: number) => void;
  revealAll: () => void;
  goToReading: () => void;
  reset: () => void;
  goToSelect: () => void;
  getSpreadName: () => string;
}

const INITIAL: ReadingState = {
  phase: 'idle',
  spreadType: null,
  cards: [],
  question: '',
};

export function useReading(): UseReadingReturn {
  const [state, setState] = useState<ReadingState>(INITIAL);

  const selectSpread = useCallback((type: SpreadType) => {
    setState((s) => ({ ...s, spreadType: type, phase: 'shuffling' }));
  }, []);

  const setQuestion = useCallback((q: string) => {
    setState((s) => ({ ...s, question: q }));
  }, []);

  const startShuffling = useCallback(() => {
    setState((s) => ({ ...s, phase: 'shuffling', cards: [] }));
  }, []);

  const setCards = useCallback(
    (cards: DrawnCard[]) => {
      setState((s) => ({ ...s, cards, phase: 'drawing' }));
    },
    []
  );

  const revealCard = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      cards: s.cards.map((c, i) =>
        i === index ? { ...c, isRevealed: true } : c
      ),
      phase: 'revealing',
    }));
  }, []);

  const revealAll = useCallback(() => {
    setState((s) => ({
      ...s,
      cards: s.cards.map((c) => ({ ...c, isRevealed: true })),
      phase: 'reading',
    }));
  }, []);

  const goToReading = useCallback(() => {
    setState((s) => ({ ...s, phase: 'reading' }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL);
  }, []);

  const goToSelect = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: 'selecting-spread',
      cards: [],
    }));
  }, []);

  const getSpreadName = useCallback(() => {
    if (!state.spreadType) return '';
    return SPREADS[state.spreadType].nameZh;
  }, [state.spreadType]);

  return {
    phase: state.phase,
    spreadType: state.spreadType,
    cards: state.cards,
    question: state.question,
    selectSpread,
    setQuestion,
    startShuffling,
    setCards,
    revealCard,
    revealAll,
    goToReading,
    reset,
    goToSelect,
    getSpreadName,
  };
}
