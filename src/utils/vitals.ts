import type { Log } from '../types';

export function getRecentAverage(logs: Log[], dogId: string, days = 3): {
  app: number | null;
  sto: number | null;
  vit: number | null;
} {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

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
  const birth = new Date(birthdate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths}ヶ月`;
  return `${Math.floor(totalMonths / 12)}歳${totalMonths % 12 ? totalMonths % 12 + 'ヶ月' : ''}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
