type Option = { label: string; value: number };

type Props = {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  color: string;
  options: Option[];
};

export function TripleToggle({ label, value, onChange, color, options }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: 8,
              border: `1.5px solid ${value === opt.value ? color : 'var(--border)'}`,
              background: value === opt.value ? `${color}22` : 'var(--bg-card)',
              color: value === opt.value ? color : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: value === opt.value ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
