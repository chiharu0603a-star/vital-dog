import React, { useState } from 'react';
import type { Dog, Log, Category, MealTime } from '../types';
import { TripleToggle } from '../components/TripleToggle';
import { PhotoPicker } from '../components/PhotoPicker';
import { DogAvatar } from '../components/DogAvatar';
import { today } from '../utils/vitals';
import { STO_OPTIONS, VIT_OPTIONS, APP_OPTIONS } from '../utils/options';

type Props = { dogs: Dog[]; onSave: (log: Log) => void };

type Step = 'dog' | 'category' | 'form';

const CAT_CONFIG = {
  honjitsu: { label: 'ほんじつ', color: '#ec4899', desc: 'うんち・げんきの記録' },
  gohan:    { label: 'ごはん',   color: '#10b981', desc: 'たべっぷりの記録' },
  taicho:   { label: 'たいちょう', color: '#6366f1', desc: '通院・体調記録（獣医用）' },
};

const MEAL_OPTIONS: { label: string; value: MealTime }[] = [
  { label: 'あさ', value: 'asa' },
  { label: 'ひる', value: 'hiru' },
  { label: 'よる', value: 'yoru' },
  { label: 'おやつ', value: 'oyatsu' },
];


export function Kiroku({ dogs, onSave }: Props) {
  const [step, setStep] = useState<Step>('dog');
  const [dogId, setDogId] = useState('');
  const [category, setCategory] = useState<Category>('honjitsu');
  const [sto, setSto] = useState<number | null>(null);
  const [vit, setVit] = useState<number | null>(null);
  const [app, setApp] = useState<number | null>(null);
  const [mealTime, setMealTime] = useState<MealTime | null>(null);
  const [note, setNote] = useState('');
  const [vet, setVet] = useState('');
  const [img, setImg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const selectedDog = dogs.find(d => d.id === dogId);

  const reset = () => {
    setStep('dog'); setDogId(''); setSto(null); setVit(null);
    setApp(null); setMealTime(null); setNote(''); setVet(''); setImg(null); setSaved(false);
  };

  const handleSave = () => {
    if (!dogId) return;
    const log: Log = {
      id: String(Date.now()),
      dogId,
      date: today(),
      category,
      app: category === 'gohan' ? app : null,
      sto: category !== 'gohan' ? sto : null,
      vit: category !== 'gohan' ? vit : null,
      mealTime: category === 'gohan' ? mealTime : null,
      note,
      vet: category === 'taicho' ? vet : null,
      img,
    };
    onSave(log);
    setSaved(true);
  };

  if (dogs.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🐾</div>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>先にわんこを登録してください</p>
      </div>
    );
  }

  if (saved) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>✅</div>
        <h2 style={{ color: 'var(--accent)', marginTop: 12 }}>保存しました！</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{selectedDog?.name}の記録を残しました</p>
        <button onClick={reset} style={primaryBtn('#10b981')}>続けて記録する</button>
      </div>
    );
  }

  // Step 1: 犬を選ぶ
  if (step === 'dog') {
    return (
      <div style={{ padding: 16 }}>
        <StepHeader step={1} total={3} title="だれの記録？" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {dogs.map(dog => (
            <button
              key={dog.id}
              onClick={() => { setDogId(dog.id); setStep('category'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 12,
                border: `2px solid ${dog.color}`,
                background: `${dog.color}11`,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <DogAvatar dog={dog} size={48} />
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{dog.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: カテゴリを選ぶ
  if (step === 'category') {
    return (
      <div style={{ padding: 16 }}>
        <StepHeader step={2} total={3} title="なにを記録？" onBack={() => setStep('dog')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {(Object.entries(CAT_CONFIG) as [Category, typeof CAT_CONFIG[Category]][]).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => { setCategory(key); setStep('form'); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: 12,
                border: `2px solid ${conf.color}`,
                background: `${conf.color}11`,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: conf.color }}>{conf.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{conf.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: 詳細フォーム
  const conf = CAT_CONFIG[category];

  return (
    <div style={{ padding: 16, paddingBottom: 40 }}>
      <StepHeader step={3} total={3} title={`${conf.label}の記録`} onBack={() => setStep('category')} />

      {category === 'taicho' && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#6366f120', border: '1px solid #6366f140', marginBottom: 16, fontSize: 13, color: '#6366f1' }}>
          ℹ️ この記録はメーターに反映されません
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {category === 'gohan' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
              いつのごはん？
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {MEAL_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMealTime(opt.value)}
                  style={{
                    flex: 1, padding: '10px 4px', borderRadius: 8,
                    border: `1.5px solid ${mealTime === opt.value ? conf.color : 'var(--border)'}`,
                    background: mealTime === opt.value ? `${conf.color}22` : 'var(--bg-card)',
                    color: mealTime === opt.value ? conf.color : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 13, fontWeight: mealTime === opt.value ? 700 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {category === 'gohan' && (
          <TripleToggle label="たべっぷり" value={app} onChange={setApp} color={conf.color} options={APP_OPTIONS} />
        )}

        {category !== 'gohan' && (
          <TripleToggle label="うんちの状態" value={sto} onChange={setSto} color={conf.color} options={STO_OPTIONS} />
        )}

        {category !== 'gohan' && (
          <TripleToggle label="げんき" value={vit} onChange={setVit} color={conf.color} options={VIT_OPTIONS} />
        )}

        {category === 'taicho' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              通院メモ
            </label>
            <textarea
              value={vet}
              onChange={e => setVet(e.target.value)}
              placeholder="症状・診断・薬など"
              rows={3}
              style={textareaStyle}
            />
          </div>
        )}

        <PhotoPicker value={img} onChange={setImg} />

        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            ひとこと
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="気になること、変化など..."
            rows={2}
            style={textareaStyle}
          />
        </div>

        <button onClick={handleSave} style={primaryBtn(conf.color)}>
          {selectedDog?.name}の記録を保存
        </button>
      </div>
    </div>
  );
}

function StepHeader({ step, total, title, onBack }: { step: number; total: number; title: string; onBack?: () => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22, padding: 0, lineHeight: 1 }}>
            ←
          </button>
        )}
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>STEP {step} / {total}</span>
      </div>
      <h2 style={{ margin: 0, fontSize: 20, color: 'var(--text-primary)' }}>{title}</h2>
    </div>
  );
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 14,
  resize: 'none',
  boxSizing: 'border-box',
};

function primaryBtn(color: string): React.CSSProperties {
  return {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: color,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  };
}
