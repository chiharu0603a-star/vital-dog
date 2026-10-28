import type { Log } from '../types';

/** Date を端末のローカル日付で YYYY-MM-DD にする（toISOString は UTC なので朝ずれる） */
export function toLocalDateStr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getRecentAverage(logs: Log[], dogId: string, days = 3): {
  app: number | null;
  sto: number | null;
  vit: number | null;
} {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = toLocalDateStr(cutoff);

  const relevant = logs.filter(
    l => l.dogId === dogId && l.category === 'honjitsu' && l.date >= cutoffStr
  );

  const avg = (field: 'app' | 'sto' | 'vit') => {
    const vals = relevant.map(l => l[field]).filter((v): v is number => v !== null);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };

  return { app: avg('app'), sto: avg('sto'), vit: avg('vit') };
}

export function getStatusBadge(avg: { app: number | null; sto: number | null; vit: number | null }): 'OPTIMAL' | 'CHECK' | 'ATTENTION' | 'NO DATA' {
  const vals = [avg.app, avg.sto, avg.vit].filter((v): v is number => v !== null);
  if (vals.length === 0) return 'NO DATA';
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (mean >= 80) return 'OPTIMAL';
  if (mean >= 50) return 'CHECK';
  return 'ATTENTION';
}

export function calcAge(birthdate: string): string {
  if (!birthdate) return '';
  // 'YYYY-MM-DD' を UTC ではなくローカル日付として解釈する
  const [by, bm, bd] = birthdate.split('-').map(Number);
  if (!by || !bm || !bd) return '';
  const now = new Date();
  let totalMonths = (now.getFullYear() - by) * 12 + (now.getMonth() + 1 - bm);
  // 今月まだ誕生日（日）に達していなければ1ヶ月引く
  if (now.getDate() < bd) totalMonths -= 1;
  if (totalMonths < 0) return '0ヶ月';
  if (totalMonths < 12) return `${totalMonths}ヶ月`;
  return `${Math.floor(totalMonths / 12)}歳${totalMonths % 12 ? totalMonths % 12 + 'ヶ月' : ''}`;
}

export function today(): string {
  return toLocalDateStr(new Date());
}
