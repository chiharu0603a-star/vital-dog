import { useState, useCallback, useEffect } from 'react';
import type { Dog, Log, Settings } from '../types';
import { storage, refreshQuotaEstimate, getStorageUsage, getAvailableBytes } from '../utils/storage';
import type { SaveResult, StorageUsage } from '../utils/storage';
import { compressDataUrl, dataUrlStorageBytes } from '../utils/image';

export type StorageMessage = { kind: 'error' | 'info'; text: string };

export function useStore() {
  const [dogs, setDogsState] = useState<Dog[]>(() => storage.getDogs());
  const [logs, setLogsState] = useState<Log[]>(() => storage.getLogs());
  const [settings, setSettingsState] = useState<Settings>(() => storage.getSettings());
  const [storageMessage, setStorageMessage] = useState<StorageMessage | null>(null);
  const [usage, setUsage] = useState<StorageUsage>(() => getStorageUsage());

  const refreshUsage = useCallback(() => {
    setUsage(getStorageUsage());
  }, []);

  useEffect(() => {
    let alive = true;
    refreshQuotaEstimate().then(() => {
      if (alive) refreshUsage();
    });
    return () => {
      alive = false;
    };
  }, [refreshUsage]);

  const clearStorageMessage = useCallback(() => setStorageMessage(null), []);

  const onSaved = useCallback(() => {
    setStorageMessage(prev => (prev?.kind === 'error' ? null : prev));
    refreshUsage();
  }, [refreshUsage]);

  const reportFailure = useCallback((res: Extract<SaveResult, { ok: false }>) => {
    setStorageMessage({
      kind: 'error',
      text: `${res.message} この変更はまだ保存できていません。古い写真を削除して空きを作ると保存できます。`,
    });
  }, []);

  // 犬の保存。容量不足なら、今回の写真を空き容量に合わせて縮小して1回だけ自動で保存し直す。
  const persistDogs = useCallback(
    async (next: Dog[], changed: Dog, prev: Dog[]) => {
      const res = storage.saveDogs(next);
      if (res.ok) {
        onSaved();
        return;
      }
      if (res.reason === 'quota' && changed.photo) {
        const prevPhoto = prev.find(d => d.id === changed.id)?.photo ?? null;
        const budget =
          getAvailableBytes() +
          (prevPhoto ? dataUrlStorageBytes(prevPhoto) : 0) -
          16 * 1024;
        if (budget > 24 * 1024) {
          const shrunk = await compressDataUrl(changed.photo, budget).catch(() => null);
          if (shrunk && dataUrlStorageBytes(shrunk) < dataUrlStorageBytes(changed.photo)) {
            const next2 = next.map(d => (d.id === changed.id ? { ...d, photo: shrunk } : d));
            const res2 = storage.saveDogs(next2);
            if (res2.ok) {
              setDogsState(next2);
              setStorageMessage({
                kind: 'info',
                text: '保存容量に合わせて、写真を少し小さくして保存しました。',
              });
              refreshUsage();
              return;
            }
          }
        }
      }
      reportFailure(res);
    },
    [onSaved, refreshUsage, reportFailure],
  );

  // 記録の保存。写真付き記録も犬と同じ自動縮小リカバリを行う。
  const persistLogs = useCallback(
    async (next: Log[], changed: Log, prev: Log[]) => {
      const res = storage.saveLogs(next);
      if (res.ok) {
        onSaved();
        return;
      }
      if (res.reason === 'quota' && changed.img) {
        const prevImg = prev.find(l => l.id === changed.id)?.img ?? null;
        const budget =
          getAvailableBytes() +
          (prevImg ? dataUrlStorageBytes(prevImg) : 0) -
          16 * 1024;
        if (budget > 24 * 1024) {
          const shrunk = await compressDataUrl(changed.img, budget).catch(() => null);
          if (shrunk && dataUrlStorageBytes(shrunk) < dataUrlStorageBytes(changed.img)) {
            const next2 = next.map(l => (l.id === changed.id ? { ...l, img: shrunk } : l));
            const res2 = storage.saveLogs(next2);
            if (res2.ok) {
              setLogsState(next2);
              setStorageMessage({
                kind: 'info',
                text: '保存容量に合わせて、写真を少し小さくして保存しました。',
              });
              refreshUsage();
              return;
            }
          }
        }
      }
      reportFailure(res);
    },
    [onSaved, refreshUsage, reportFailure],
  );

  const saveDog = useCallback(
    (dog: Dog) => {
      setDogsState(prev => {
        const idx = prev.findIndex(d => d.id === dog.id);
        const next =
          idx >= 0 ? prev.map(d => (d.id === dog.id ? dog : d)) : [...prev, dog];
        void persistDogs(next, dog, prev);
        return next;
      });
    },
    [persistDogs],
  );

  const deleteDog = useCallback(
    (id: string) => {
      setDogsState(prev => {
        const next = prev.filter(d => d.id !== id);
        const res = storage.saveDogs(next);
        if (res.ok) refreshUsage();
        else reportFailure(res);
        return next;
      });
      setLogsState(prev => {
        const next = prev.filter(l => l.dogId !== id);
        const res = storage.saveLogs(next);
        if (res.ok) refreshUsage();
        else reportFailure(res);
        return next;
      });
    },
    [refreshUsage, reportFailure],
  );

  const saveLog = useCallback(
    (log: Log) => {
      setLogsState(prev => {
        const idx = prev.findIndex(l => l.id === log.id);
        const next =
          idx >= 0 ? prev.map(l => (l.id === log.id ? log : l)) : [...prev, log];
        void persistLogs(next, log, prev);
        return next;
      });
    },
    [persistLogs],
  );

  const deleteLog = useCallback(
    (id: string) => {
      setLogsState(prev => {
        const next = prev.filter(l => l.id !== id);
        const res = storage.saveLogs(next);
        if (res.ok) refreshUsage();
        else reportFailure(res);
        return next;
      });
    },
    [refreshUsage, reportFailure],
  );

  const saveSettings = useCallback(
    (s: Settings) => {
      setSettingsState(s);
      const res = storage.saveSettings(s);
      if (res.ok) onSaved();
      else reportFailure(res);
    },
    [onSaved, reportFailure],
  );

  const clearAll = useCallback(() => {
    storage.clearAll();
    setDogsState([]);
    setLogsState([]);
    setSettingsState({ theme: 'dark' });
    setStorageMessage(null);
    refreshUsage();
  }, [refreshUsage]);

  return {
    dogs,
    logs,
    settings,
    saveDog,
    deleteDog,
    saveLog,
    deleteLog,
    saveSettings,
    clearAll,
    usage,
    storageMessage,
    clearStorageMessage,
  };
}
