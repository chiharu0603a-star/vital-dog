import type { Dog, Log, Settings } from '../types';

const KEYS = {
  dogs: 'vital-dog-dogs',
  logs: 'vital-dog-logs',
  settings: 'vital-dog-settings',
  onboarded: 'vital-dog-onboarded',
  navDogId: 'vital-dog-nav-dog',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getDogs: (): Dog[] => load<Dog[]>(KEYS.dogs, []),
  saveDogs: (dogs: Dog[]) => save(KEYS.dogs, dogs),

  getLogs: (): Log[] => load<Log[]>(KEYS.logs, []),
  saveLogs: (logs: Log[]) => save(KEYS.logs, logs),

  getSettings: (): Settings => load<Settings>(KEYS.settings, { theme: 'dark' }),
  saveSettings: (s: Settings) => save(KEYS.settings, s),

  isOnboarded: (): boolean => load<boolean>(KEYS.onboarded, false),
  setOnboarded: () => save(KEYS.onboarded, true),

  getNavDogId: (): string | null => load<string | null>(KEYS.navDogId, null),
  saveNavDogId: (id: string) => save(KEYS.navDogId, id),

  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
