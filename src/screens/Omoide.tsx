import React, { useState } from 'react';
import type { Dog, Log } from '../types';
import { CategoryBadge } from '../components/CategoryBadge';
import { DogAvatar } from '../components/DogAvatar';
import { STO_OPTIONS, VIT_OPTIONS, APP_OPTIONS, scoreToLabel } from '../utils/options';

type Props = { dogs: Dog[]; logs: Log[]; onDeleteLog: (id: string) => void };

export function Omoide({ dogs, logs, onDeleteLog }: Props) {
  const [filterDog, setFilterDog] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = [...logs]
    .filter(l => filterDog === 'all' || l.dogId === filterDog)
    .sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div>
      <div style={{ padding: '16px 16px 8px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 20, color: 'var(--text-primary)' }}>おもいで</h2>

        {/* フィルター */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          <FilterBtn label="みんな" active={filterDog === 'all'} onClick={() => setFilterDog('all')} />
          {dogs.map(dog => (
            <FilterBtn
              key={dog.id}
              label={dog.name}
              active={filterDog === dog.id}
              onClick={() => setFilterDog(dog.id)}
              color={dog.color}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>📷</div>
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>記録がありません</p>
        </div>
      ) : (
        <div style={{ padding: '0 12px 24px' }}>
          {filtered.map(log => {
            const dog = dogs.find(d => d.id === log.dogId);
            return (
              <div key={log.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {dog && <DogAvatar dog={dog} size={28} />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {dog?.name ?? '不明'}
                  </span>
                  <CategoryBadge category={log.category} small />
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                    {log.date}
                  </span>
                </div>

                {log.img && (
                  <img src={log.img} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8, display: 'block' }} />
                )}

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                  {log.sto !== null && <Metric label="うんち" value={log.sto} options={STO_OPTIONS} />}
                  {log.vit !== null && <Metric label="げんき" value={log.vit} options={VIT_OPTIONS} />}
                  {log.app !== null && <Metric label="たべっぷり" value={log.app} options={APP_OPTIONS} />}
                  {log.mealTime && <span style={tagStyle}>{mealLabel(log.mealTime)}</span>}
                </div>

                {log.vet && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0' }}>通院: {log.vet}</p>}
                {log.note && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0' }}>{log.note}</p>}

                <button
                  onClick={() => setConfirmDelete(log.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, padding: '4px 0', marginTop: 4 }}
                >
                  削除
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 削除確認 */}
      {confirmDelete && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <p style={{ color: 'var(--text-primary)', marginBottom: 20 }}>この記録を削除しますか？</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={cancelBtnStyle}>キャンセル</button>
              <button
                onClick={() => { onDeleteLog(confirmDelete); setConfirmDelete(null); }}
                style={{ ...cancelBtnStyle, background: '#ef4444', color: '#fff', border: 'none' }}
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBtn({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', flexShrink: 0,
        border: `1.5px solid ${active ? (color ?? 'var(--accent)') : 'var(--border)'}`,
        background: active ? `${color ?? '#10b981'}22` : 'var(--bg-card)',
        color: active ? (color ?? 'var(--accent)') : 'var(--text-secondary)',
        fontWeight: active ? 700 : 400,
      }}
    >
      {label}
    </button>
  );
}

import type { VitalOption } from '../utils/options';

function Metric({ label, value, options }: { label: string; value: number; options: VitalOption[] }) {
  const display = scoreToLabel(value, options);
  return (
    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
      {label}: <strong>{display}</strong>
    </span>
  );
}

function mealLabel(mt: string) {
  return { asa: 'あさ', hiru: 'ひる', yoru: 'よる', oyatsu: 'おやつ' }[mt] ?? mt;
}

const tagStyle: React.CSSProperties = {
  fontSize: 11, padding: '2px 6px', borderRadius: 10,
  background: '#10b98120', color: '#10b981', border: '1px solid #10b98140',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  borderRadius: 12,
  padding: '12px 14px',
  marginBottom: 10,
  border: '1px solid var(--border)',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: '#00000080',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
};

const dialogStyle: React.CSSProperties = {
  background: 'var(--bg-surface)', borderRadius: 16, padding: 24,
  width: 280, border: '1px solid var(--border)',
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: '10px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--bg-card)',
  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14,
};
