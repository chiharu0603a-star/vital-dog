import React, { useState } from 'react';
import type { Dog } from '../types';
import { PhotoPicker } from '../components/PhotoPicker';
import { TripleToggle } from '../components/TripleToggle';
import { STO_OPTIONS, VIT_OPTIONS, APP_OPTIONS } from '../utils/options';

const COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#f97316'];

type Props = { onComplete: (dog: Dog) => void };

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // ステップ2〜4 練習用ダミー状態（保存しない）
  const [dummySto, setDummySto] = useState<number | null>(null);
  const [dummyApp, setDummyApp] = useState<number | null>(null);
  const [dummyVit, setDummyVit] = useState<number | null>(null);
  const [dummyVet, setDummyVet] = useState('');

  const handleStep1Next = () => {
    if (!name.trim()) { setErrors({ name: '名前を入力してください' }); return; }
    setStep(2);
  };

  const handleFinish = () => {
    const dog: Dog = {
      id: String(Date.now()),
      name: name.trim(),
      breed: '',
      birthdate: '',
      gender: 'unknown',
      color,
      photo,
      species: 'dog',
    };
    onComplete(dog);
  };

  const stepDots = [1, 2, 3, 4, 5];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '20px 16px 0' }}>
        {stepDots.map(n => (
          <div key={n} style={{
            width: n === step ? 20 : 8, height: 8, borderRadius: 4,
            background: n <= step ? 'var(--accent)' : 'var(--border)',
            transition: 'width 0.3s',
          }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>

        {/* Step 1: わんこの登録 */}
        {step === 1 && (
          <>
            <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>🐾 Vital Dogへようこそ</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>まずはわんこを登録しましょう</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${color}22`, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, overflow: 'hidden' }}>
                {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🐶'}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>テーマカラー</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setColor(c)} style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', outline: color === c ? `3px solid ${c}` : '3px solid transparent', outlineOffset: 2 }} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>名前 <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setErrors({}); }}
                placeholder="例：ハチ"
                style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : 'var(--border)' }}
                autoFocus
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <PhotoPicker value={photo} onChange={setPhoto} label="しゃしん（任意）" />
            </div>

            <button onClick={handleStep1Next} style={primaryBtn(color)}>次へ →</button>
          </>
        )}

        {/* Step 2: ほんじつの練習 */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: 22, margin: '0 0 8px', color: '#ec4899' }}>ほんじつの記録</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              毎日の「うんち」と「げんき」を記録します。<br />
              直近3日間の平均がダッシュボードに表示されます。
            </p>
            <TripleToggle label="うんちの状態（練習）" value={dummySto} onChange={setDummySto} color="#ec4899" options={STO_OPTIONS} />
            <TripleToggle label="げんき（練習）" value={dummyVit} onChange={setDummyVit} color="#ec4899" options={VIT_OPTIONS} />
            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <button onClick={() => setStep(3)} style={{ ...primaryBtn('#ec4899'), flex: 1 }}>次へ →</button>
              <button onClick={() => setStep(5)} style={skipBtnStyle}>スキップ</button>
            </div>
          </>
        )}

        {/* Step 3: ごはんの練習 */}
        {step === 3 && (
          <>
            <h2 style={{ fontSize: 22, margin: '0 0 8px', color: '#10b981' }}>ごはんの記録</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              いつのごはんか・たべっぷりを記録します。
            </p>
            <TripleToggle label="たべっぷり（練習）" value={dummyApp} onChange={setDummyApp} color="#10b981" options={APP_OPTIONS} />
            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <button onClick={() => setStep(4)} style={{ ...primaryBtn('#10b981'), flex: 1 }}>次へ →</button>
              <button onClick={() => setStep(5)} style={skipBtnStyle}>スキップ</button>
            </div>
          </>
        )}

        {/* Step 4: たいちょうの練習 */}
        {step === 4 && (
          <>
            <h2 style={{ fontSize: 22, margin: '0 0 8px', color: '#6366f1' }}>たいちょうの記録</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: 14 }}>
              通院時の症状や診断内容を記録できます。
            </p>

            {/* 注意書き — より目立つデザイン */}
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f130, #8b5cf620)',
              border: '1.5px solid #6366f1',
              marginBottom: 20,
            }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#a5b4fc' }}>
                ℹ️ この記録はメーターに反映されません
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#818cf8' }}>
                💡 獣医師に見せると役立ちます
              </p>
            </div>

            <TripleToggle
              label="うんちの状態（練習）"
              value={dummySto}
              onChange={setDummySto}
              color="#6366f1"
              options={STO_OPTIONS}
            />
            <TripleToggle
              label="げんき（練習）"
              value={dummyVit}
              onChange={setDummyVit}
              color="#6366f1"
              options={VIT_OPTIONS}
            />

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                通院メモ（任意・練習）
              </label>
              <textarea
                value={dummyVet}
                onChange={e => setDummyVet(e.target.value)}
                placeholder="例：食欲がない、水をよく飲む"
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text-primary)', fontSize: 14,
                  resize: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(5)} style={{ ...primaryBtn('#6366f1'), flex: 1 }}>次へ →</button>
              <button onClick={() => setStep(5)} style={skipBtnStyle}>スキップ</button>
            </div>
          </>
        )}

        {/* Step 5: ようすの確認 */}
        {step === 5 && (
          <>
            <h2 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--accent)' }}>ようすを確認しよう</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              トップの「ようす」画面では、<strong style={{ color: 'var(--text-primary)' }}>直近3日間のほんじつ記録の平均</strong>が<br />
              メーターで表示されます。
            </p>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : '🐾'}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, background: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}>OPTIMAL</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>たべっぷり・うんち・げんきの平均が<br />ここに表示されます</div>
            </div>
            <button onClick={handleFinish} style={primaryBtn(color)}>
              はじめる 🎉
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--bg-card)',
  color: 'var(--text-primary)', fontSize: 16, boxSizing: 'border-box',
};

function primaryBtn(color: string): React.CSSProperties {
  return {
    padding: '14px', borderRadius: 12, border: 'none',
    background: color, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
  };
}

const skipBtnStyle: React.CSSProperties = {
  padding: '14px 16px', borderRadius: 12,
  border: '1px solid var(--border)', background: 'var(--bg-card)',
  color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer',
};
