import React, { useState } from 'react';
import type { Dog, Settings } from '../types';
import { DogAvatar } from '../components/DogAvatar';
import { calcAge } from '../utils/vitals';
import { formatBytes } from '../utils/storage';
import type { StorageUsage } from '../utils/storage';
import { Help } from './Help';

type Props = {
  dogs: Dog[];
  settings: Settings;
  usage: StorageUsage;
  navDogId: string | null;
  onEditDog: (dog: Dog | null) => void;
  onSaveSettings: (s: Settings) => void;
  onChangeNavDog: (id: string) => void;
};

export function Settei({ dogs, settings, usage, navDogId, onEditDog, onSaveSettings, onChangeNavDog }: Props) {
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

        {dogs.length > 1 && (
          <>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ padding: '12px 0 4px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px' }}>
                ナビに表示するわんこ
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 8 }}>
                {dogs.map(dog => {
                  const selected = dog.id === navDogId;
                  return (
                    <button
                      key={dog.id}
                      onClick={() => onChangeNavDog(dog.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
                        border: `1.5px solid ${selected ? dog.color : 'var(--border)'}`,
                        background: selected ? `${dog.color}18` : 'var(--bg-base)',
                      }}
                    >
                      <DogAvatar dog={dog} size={32} />
                      <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)', textAlign: 'left', fontWeight: selected ? 700 : 400 }}>
                        {dog.name}
                      </span>
                      {selected && (
                        <span style={{ fontSize: 16, color: dog.color }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Section>

      {/* データ保存量 */}
      <Section title="データ保存">
        <div style={{ padding: '12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>保存容量の使用量</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: usage.percent >= 90 ? '#ef4444' : 'var(--text-primary)' }}>
              {formatBytes(usage.usedBytes)} / 約{formatBytes(usage.quotaBytes)}（{usage.percent}%）
            </span>
          </div>
          <div style={{ height: 8, background: 'var(--bg-base)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${usage.percent}%`,
                height: '100%',
                borderRadius: 4,
                background: usage.percent >= 90 ? '#ef4444' : usage.percent >= 75 ? '#f59e0b' : 'var(--accent)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0' }}>
            うち写真： {formatBytes(usage.photoBytes)}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.6 }}>
            容量がいっぱいに近づくと、新しい写真は自動で小さくして保存します。それでも保存できないときは、画面の上部にお知らせが出ます（写真が無言で消えることはありません）。
          </p>
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
