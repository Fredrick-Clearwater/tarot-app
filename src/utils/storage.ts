import type { ReadingRecord } from '../types';

const HISTORY_KEY = 'tarot-reading-history';

export function loadHistory(): ReadingRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReadingRecord[];
  } catch {
    return [];
  }
}

export function saveRecord(record: ReadingRecord): void {
  const history = loadHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function deleteRecord(id: string): void {
  const history = loadHistory().filter((r) => r.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getRecord(id: string): ReadingRecord | undefined {
  return loadHistory().find((r) => r.id === id);
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function exportHistoryAsJSON(): string {
  return JSON.stringify(loadHistory(), null, 2);
}
