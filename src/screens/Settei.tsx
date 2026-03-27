import React, { useState } from 'react';
import type { Dog, Settings } from '../types';
import { DogAvatar } from '../components/DogAvatar';
import { calcAge } from '../utils/vitals';
import { Help } from './Help';

type Props = {
  dogs: Dog[];
  settings: Settings;
  onEditDog: (dog: Dog | null) => void;
  onSaveSettings: (s: Settings) => void;
};

export function Settei({ dogs, settings, onEditDog, onSaveSettings }: Props) {
  const [showHelp, setShowHelp] = useState(false);
  const remaining = 3 - dogs.length;

  if (showHelp) {
    return <Help onBack={() => setShowHelp(false)} />;
  }

  return (
    <div style={{ padding: 16, paddingBottom: 40 }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 20 }}>せってい</h2>

      {/* 犬の管理 */}
      <Section title="わんこの管理">
        {dogs.map(dog => (
          <button key={dog.id} onClick={() => onEditDog(dog)} style={dogRowStyle}>
            <DogAvatar dog={dog} size={44} />
            <div style={{ flex: 1, minWidth: 0, marginLeft: 12, textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{dog.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {dog.breed && <span>{dog.breed} · </span>}
                {dog.birthdate && <span>{calcAge(dog.birthdate)}</span>}
                {dog.gender !== 'unknown' && <span> · {dog.gender === 'male' ? 'オス' : 'メス'}</span>}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>›</span>
          </button>
        ))}
        {remaining > 0 ? (
          <button
            onClick={() => onEditDog(null)}
            style={{ ...dogRowStyle, borderTop: dogs.length > 0 ? '1px solid var(--border)' : 'none', justifyContent: 'center', color: 'var(--accent)' }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>＋</span>
            <span>わんこを追加（残り{remaining}匹）</span>
          </button>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px' }}>
            登録上限（3匹）に達しています
          </p>
        )}
      </Section>

      {/* アプリ設定 */}
      <Section title="アプリ設定">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>テーマ</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['dark', 'light'] as const).map(t => (
              <button
                key={t}
                onClick={() => onSaveSettings({ ...settings, theme: t })}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  border: `1.5px solid ${settings.theme === t ? 'var(--accent)' : 'var(--border)'}`,
                  background: settings.theme === t ? 'var(--accent)22' : 'var(--bg-card)',
                  color: settings.theme === t ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: settings.theme === t ? 700 : 400,
                }}
              >
                {t === 'dark' ? '🌙 ダーク' : '☀️ ライト'}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ヘルプ */}
      <Section title="サポート">
        <button
          onClick={() => setShowHelp(true)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>❓ ヘルプ</span>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </button>
      </Section>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 24 }}>
        Vital Dog v1.0.0
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 1, margin: '0 0 8px' }}>
        {title.toUpperCase()}
      </h3>
      <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', padding: '0 12px' }}>
        {children}
      </div>
    </div>
  );
}

const dogRowStyle: React.CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center',
  padding: '12px 0', background: 'none', border: 'none',
  cursor: 'pointer', fontSize: 15, color: 'var(--text-primary)',
};
