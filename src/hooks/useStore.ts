import { useState, useCallback } from 'react';
import type { Dog, Log, Settings } from '../types';
import { storage } from '../utils/storage';

export function useStore() {
  const [dogs, setDogsState] = useState<Dog[]>(() => storage.getDogs());
  const [logs, setLogsState] = useState<Log[]>(() => storage.getLogs());
  const [settings, setSettingsState] = useState<Settings>(() => storage.getSettings());

  const saveDog = useCallback((dog: Dog) => {
    setDogsState(prev => {
      const idx = prev.findIndex(d => d.id === dog.id);
      const next = idx >= 0
        ? prev.map(d => d.id === dog.id ? dog : d)
        : [...prev, dog];
      storage.saveDogs(next);
      return next;
    });
  }, []);

  const deleteDog = useCallback((id: string) => {
    setDogsState(prev => {
      const next = prev.filter(d => d.id !== id);
      storage.saveDogs(next);
      return next;
    });
    setLogsState(prev => {
      const next = prev.filter(l => l.dogId !== id);
      storage.saveLogs(next);
      return next;
    });
  }, []);

  const saveLog = useCallback((log: Log) => {
    setLogsState(prev => {
      const idx = prev.findIndex(l => l.id === log.id);
      const next = idx >= 0
        ? prev.map(l => l.id === log.id ? log : l)
        : [...prev, log];
      storage.saveLogs(next);
      return next;
    });
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogsState(prev => {
      const next = prev.filter(l => l.id !== id);
      storage.saveLogs(next);
      return next;
    });
  }, []);

  const saveSettings = useCallback((s: Settings) => {
    setSettingsState(s);
    storage.saveSettings(s);
  }, []);

  const clearAll = useCallback(() => {
    storage.clearAll();
    setDogsState([]);
    setLogsState([]);
    setSettingsState({ theme: 'dark' });
  }, []);

  return { dogs, logs, settings, saveDog, deleteDog, saveLog, deleteLog, saveSettings, clearAll };
}
