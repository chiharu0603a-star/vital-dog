export type VitalOption = { label: string; value: number };

export const STO_OPTIONS: VitalOption[] = [
  { label: 'ゆるい',  value: 33 },
  { label: 'ふつう',  value: 66 },
  { label: 'よい',    value: 100 },
];

export const VIT_OPTIONS: VitalOption[] = [
  { label: 'ぐったり', value: 33 },
  { label: 'ふつう',   value: 66 },
  { label: 'げんき',   value: 100 },
];

export const APP_OPTIONS: VitalOption[] = [
  { label: 'わるい',     value: 33 },
  { label: 'ふつう',     value: 66 },
  { label: 'よくたべる', value: 100 },
];

/** スコア値からラベルを返す */
export function scoreToLabel(value: number, options: VitalOption[]): string {
  return options.find(o => o.value === value)?.label
    ?? options.reduce((prev, cur) =>
        Math.abs(cur.value - value) < Math.abs(prev.value - value) ? cur : prev
      ).label;
}
