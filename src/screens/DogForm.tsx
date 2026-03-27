import React, { useState } from 'react';
import type { Dog } from '../types';
import { PhotoPicker } from '../components/PhotoPicker';
import { calcAge } from '../utils/vitals';

const COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#f97316'];

type Props = {
  initial?: Dog;
  onSave: (dog: Dog) => void;
  onDelete?: (id: string) => void;
  onBack: () => void;
};

export function DogForm({ initial, onSave, onDelete, onBack }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [breed, setBreed] = useState(initial?.breed ?? '');
  const [birthdate, setBirthdate] = useState(initial?.birthdate ?? '');
  const [gender, setGender] = useState<Dog['gender']>(initial?.gender ?? 'unknown');
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [photo, setPhoto] = useState<string | null>(initial?.photo ?? null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSave = () => {
    if (!name.trim()) { setErrors({ name: '名前は必須です' }); return; }
    const dog: Dog = {
      id: initial?.id ?? String(Date.now()),
      name: name.trim(),
      breed,
      birthdate,
      gender,
      color,
      photo,
      species: 'dog',
    };
    onSave(dog);
    onBack();
  };

  return (
    <div style={{ padding: 16, paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={backBtnStyle}>←</button>
        <h2 style={{ margin: 0, fontSize: 18 }}>{initial ? 'わんこを編集' : 'わんこを追加'}</h2>
      </div>

      {/* しゃしん */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          {photo ? (
            <img src={photo} alt="" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${color}` }} />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: `${color}22`, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🐾</div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>しゃしん</label>
        <PhotoPicker value={photo} onChange={setPhoto} label="" />
      </div>

      {/* アイコンカラー */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>テーマカラー</label>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: 34, height: 34, borderRadius: '50%', background: c, border: 'none',
                cursor: 'pointer',
                outline: color === c ? `3px solid ${c}` : '3px solid transparent',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* 名前 */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>名前 <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setErrors({}); }}
          placeholder="例：ハチ"
          style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : 'var(--border)' }}
        />
        {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
      </div>

      {/* 犬種 */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>犬種（任意）</label>
        <input value={breed} onChange={e => setBreed(e.target.value)} placeholder="例：柴犬" style={inputStyle} />
      </div>

      {/* 生年月日 */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>生年月日（任意）</label>
        <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} style={inputStyle} />
        {birthdate && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>年齢: {calcAge(birthdate)}</p>}
      </div>

      {/* 性別 */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>性別</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {([['male', 'オス'], ['female', 'メス'], ['unknown', '不明']] as const).map(([val, lbl]) => (
            <button
              key={val}
              type="button"
              onClick={() => setGender(val)}
              style={{
                flex: 1, padding: '10px', borderRadius: 8,
                border: `1.5px solid ${gender === val ? color : 'var(--border)'}`,
                background: gender === val ? `${color}22` : 'var(--bg-card)',
                color: gender === val ? color : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 14, fontWeight: gender === val ? 700 : 400,
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: color, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>
        {initial ? '変更を保存' : 'わんこを追加'}
      </button>

      {initial && onDelete && (
        <button onClick={() => setConfirmDelete(true)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: 14, cursor: 'pointer' }}>
          このわんこを削除
        </button>
      )}

      {confirmDelete && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>削除しますか？</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {name}のデータと記録がすべて削除されます。
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(false)} style={cancelBtnStyle}>キャンセル</button>
              <button
                onClick={() => { onDelete!(initial!.id); onBack(); }}
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

const labelStyle: React.CSSProperties = {
  fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--bg-card)',
  color: 'var(--text-primary)', fontSize: 15, boxSizing: 'border-box',
};

const backBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--text-muted)',
  cursor: 'pointer', fontSize: 22, padding: 0, lineHeight: 1,
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
