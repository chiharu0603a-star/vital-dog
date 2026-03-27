import type { Category } from '../types';

const MAP: Record<Category, { label: string; color: string; bg: string }> = {
  honjitsu: { label: 'ほんじつ', color: '#ec4899', bg: '#ec489920' },
  gohan:    { label: 'ごはん',   color: '#10b981', bg: '#10b98120' },
  taicho:   { label: 'たいちょう', color: '#6366f1', bg: '#6366f120' },
};

type Props = { category: Category; small?: boolean };

export function CategoryBadge({ category, small }: Props) {
  const m = MAP[category];
  return (
    <span style={{
      display: 'inline-block',
      padding: small ? '2px 6px' : '3px 8px',
      borderRadius: 20,
      fontSize: small ? 10 : 11,
      fontWeight: 600,
      color: m.color,
      background: m.bg,
      border: `1px solid ${m.color}40`,
    }}>
      {m.label}
    </span>
  );
}

export { MAP as CATEGORY_MAP };
