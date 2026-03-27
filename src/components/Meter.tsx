
type Props = {
  label: string;
  value: number | null;
  color: string;
  mini?: boolean;
};

export function Meter({ label, value, color, mini = false }: Props) {
  const pct = value ?? 0;
  const hasData = value !== null;

  if (mini) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 80 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 32 }}>{label}</span>
        <div style={{ flex: 1, height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: hasData ? color : 'var(--text-muted)',
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: hasData ? color : 'var(--text-muted)' }}>
          {hasData ? `${pct}%` : '--'}
        </span>
      </div>
      <div style={{ height: 8, background: 'var(--bg-card)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: hasData
            ? `linear-gradient(90deg, ${color}88, ${color})`
            : 'var(--text-muted)',
          borderRadius: 4,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
