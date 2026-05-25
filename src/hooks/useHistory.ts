import { useState, useCallback, useEffect } from 'react';
import type { ReadingRecord } from '../types';
import { loadHistory, saveRecord, deleteRecord, clearHistory } from '../utils/storage';

interface UseHistoryReturn {
  records: ReadingRecord[];
  save: (record: ReadingRecord) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function useHistory(): UseHistoryReturn {
  const [records, setRecords] = useState<ReadingRecord[]>([]);

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const save = useCallback((record: ReadingRecord) => {
    saveRecord(record);
    setRecords(loadHistory());
  }, []);

  const remove = useCallback((id: string) => {
    deleteRecord(id);
    setRecords(loadHistory());
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setRecords([]);
  }, []);

  return { records, save, remove, clear };
}
