import type { Dog, Log, Settings } from '../types';

const KEYS = {
  dogs: 'vital-dog-dogs',
  logs: 'vital-dog-logs',
  settings: 'vital-dog-settings',
  onboarded: 'vital-dog-onboarded',
  navDogId: 'vital-dog-nav-dog',
} as const;

// localStorage は文字列を UTF-16 で保持するため、1文字 ≈ 2バイトとして見積もる
const BYTES_PER_CHAR = 2;
// localStorage の上限の目安。多くのブラウザで 1オリジンあたり約5MB。
// 実際の書き込み成否は try/catch でも判定するので、これは事前チェック用の保守的な値。
const FALLBACK_QUOTA_BYTES = 5 * 1024 * 1024;

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: 'quota' | 'error'; message: string };

export type StorageUsage = {
  usedBytes: number;
  quotaBytes: number;
  percent: number;
  photoBytes: number;
};

let quotaBytes = FALLBACK_QUOTA_BYTES;

// ブラウザがより小さい上限を申告している場合だけ、それに合わせる
export async function refreshQuotaEstimate(): Promise<void> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      if (est.quota && est.quota > 0 && est.quota < quotaBytes) {
        quotaBytes = est.quota;
      }
    }
  } catch {
    // 取得できなければ目安のまま
  }
}

function entryBytes(key: string, value: string): number {
  return (key.length + value.length) * BYTES_PER_CHAR;
}

export function measureUsedBytes(): number {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key);
      total += entryBytes(key, value ?? '');
    }
  } catch {
    // 読めない場合は 0 として扱う
  }
  return total;
}

export function getAvailableBytes(): number {
  return Math.max(0, quotaBytes - measureUsedBytes());
}

function measurePhotoBytes(): number {
  let bytes = 0;
  try {
    const dogs = load<Dog[]>(KEYS.dogs, []);
    for (const d of dogs) if (d.photo) bytes += d.photo.length * BYTES_PER_CHAR;
    const logs = load<Log[]>(KEYS.logs, []);
    for (const l of logs) if (l.img) bytes += l.img.length * BYTES_PER_CHAR;
  } catch {
    // 測れない場合は 0
  }
  return bytes;
}

export function getStorageUsage(): StorageUsage {
  const usedBytes = measureUsedBytes();
  return {
    usedBytes,
    quotaBytes,
    percent: Math.min(100, Math.round((usedBytes / quotaBytes) * 100)),
    photoBytes: measurePhotoBytes(),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isQuotaError(e: unknown): boolean {
  if (typeof DOMException !== 'undefined' && e instanceof DOMException) {
    return e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014;
  }
  return e instanceof Error && /quota/i.test(e.name + e.message);
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// 書き込む前に容量を見積もり、入りきらない場合は既存データを壊さずに失敗を返す。
// 失敗は呼び出し側が必ず利用者へ伝えること（無言で消えるのを防ぐ）。
function save(key: string, value: unknown): SaveResult {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return { ok: false, reason: 'error', message: '保存データの作成に失敗しました。' };
  }

  const old = localStorage.getItem(key);
  const oldBytes = old ? entryBytes(key, old) : 0;
  const projected = measureUsedBytes() - oldBytes + entryBytes(key, serialized);
  if (projected > quotaBytes) {
    return {
      ok: false,
      reason: 'quota',
      message: `保存容量が足りません（空きは約${formatBytes(getAvailableBytes())}です）。`,
    };
  }

  try {
    localStorage.setItem(key, serialized);
    return { ok: true };
  } catch (e) {
    if (isQuotaError(e)) {
      return { ok: false, reason: 'quota', message: '保存容量がいっぱいで、保存できませんでした。' };
    }
    return { ok: false, reason: 'error', message: '保存に失敗しました。' };
  }
}

export const storage = {
  getDogs: (): Dog[] => load<Dog[]>(KEYS.dogs, []),
  saveDogs: (dogs: Dog[]): SaveResult => save(KEYS.dogs, dogs),

  getLogs: (): Log[] => load<Log[]>(KEYS.logs, []),
  saveLogs: (logs: Log[]): SaveResult => save(KEYS.logs, logs),

  getSettings: (): Settings => load<Settings>(KEYS.settings, { theme: 'dark' }),
  saveSettings: (s: Settings): SaveResult => save(KEYS.settings, s),

  isOnboarded: (): boolean => load<boolean>(KEYS.onboarded, false),
  setOnboarded: (): SaveResult => save(KEYS.onboarded, true),

  getNavDogId: (): string | null => load<string | null>(KEYS.navDogId, null),
  saveNavDogId: (id: string): SaveResult => save(KEYS.navDogId, id),

  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
