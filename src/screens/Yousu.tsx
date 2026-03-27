import React, { useState } from 'react';
import type { Dog, Log } from '../types';
import { getRecentAverage, getStatusBadge } from '../utils/vitals';
import { Meter } from '../components/Meter';
import { CategoryBadge } from '../components/CategoryBadge';
import { DogAvatar } from '../components/DogAvatar';

type Props = { dogs: Dog[]; logs: Log[] };

const STATUS_COLOR = {
  OPTIMAL: '#10b981',
  CHECK: '#f59e0b',
  ATTENTION: '#ef4444',
  'NO DATA': '#6b7280',
} as const;

export function Yousu({ dogs, logs }: Props) {
  const [expanded, setExpanded] = useState<string | null>(dogs[0]?.id ?? null);
  const [reportMode, setReportMode] = useState(false);

  const recent4 = [...logs]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 4);

  const taichoLogs = [...logs]
    .filter(l => l.category === 'taicho')
    .sort((a, b) => b.date.localeCompare(a.date));

  if (dogs.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
        <p style={{ color: 'var(--text-secondary)' }}>わんこを登録してください</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>「せってい」から追加できます</p>
      </div>
    );
  }

  if (reportMode) {
    return (
      <div>
        <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setReportMode(false)} style={backBtnStyle}>← もどる</button>
          <h2 style={{ margin: 0, fontSize: 16, color: 'var(--accent)' }}>診察用レポート</h2>
        </div>
        <p style={{ padding: '0 16px', fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          たいちょうの記録のみ表示（獣医師にご提示ください）
        </p>
        {taichoLogs.length === 0 ? (
          <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>記録がありません</p>
        ) : taichoLogs.map(log => {
          const dog = dogs.find(d => d.id === log.dogId);
          return (
            <div key={log.id} style={reportCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.date}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dog?.name ?? '不明'}</span>
              </div>
              {log.vet && <p style={{ margin: '4px 0', fontSize: 13, color: 'var(--text-primary)' }}>{log.vet}</p>}
              {log.note && <p style={{ margin: '4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>{log.note}</p>}
              {log.img && <img src={log.img} alt="" style={{ width: '100%', borderRadius: 6, marginTop: 6 }} />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--accent)' }}>Vital</span> Dog
        </h1>
        <button onClick={() => setReportMode(true)} style={reportBtnStyle}>
          🏥 診察用レポート
        </button>
      </div>

      {/* Dogs list */}
      <div style={{ padding: '0 12px' }}>
        {dogs.map(dog => {
          const avg = getRecentAverage(logs, dog.id);
          const status = getStatusBadge(avg);
          const isOpen = expanded === dog.id;

          return (
            <div key={dog.id} style={dogCardStyle}>
              <button
                onClick={() => setExpanded(isOpen ? null : dog.id)}
                style={dogRowBtnStyle}
              >
                <DogAvatar dog={dog} size={36} />
                <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{dog.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10,
                      color: STATUS_COLOR[status], background: `${STATUS_COLOR[status]}20`,
                      border: `1px solid ${STATUS_COLOR[status]}40`,
                    }}>
                      {status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <Meter label="たべ" value={avg.app} color="#10b981" mini />
                    <Meter label="うんち" value={avg.sto} color="#ec4899" mini />
                    <Meter label="げんき" value={avg.vit} color="#8b5cf6" mini />
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 18, marginLeft: 8 }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '12px 12px 4px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                    直近3日間の平均（ほんじつの記録より）
                  </p>
                  <Meter label="たべっぷり" value={avg.app} color="#10b981" />
                  <Meter label="うんち" value={avg.sto} color="#ec4899" />
                  <Meter label="げんき" value={avg.vit} color="#8b5cf6" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{ padding: '16px 12px 8px' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-muted)', letterSpacing: 1 }}>
          RECENT ACTIVITY
        </h3>
        {recent4.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 16 }}>
            まだ記録がありません
          </p>
        ) : recent4.map(log => {
          const dog = dogs.find(d => d.id === log.dogId);
          return (
            <div key={log.id} style={activityStyle}>
              {dog && <DogAvatar dog={dog} size={28} />}
              <div style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {dog?.name ?? '不明'}
                  </span>
                  <CategoryBadge category={log.category} small />
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.note || log.vet || log.date}
                </p>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{log.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const dogCardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  borderRadius: 12,
  marginBottom: 10,
  border: '1px solid var(--border)',
  overflow: 'hidden',
};

const dogRowBtnStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '10px 12px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
};

const activityStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid var(--border)',
};

const reportBtnStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid #6366f1',
  background: '#6366f120',
  color: '#6366f1',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
};

const backBtnStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: 13,
};

const reportCardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  borderRadius: 10,
  padding: '12px 16px',
  margin: '0 16px 10px',
  border: '1px solid var(--border)',
};
