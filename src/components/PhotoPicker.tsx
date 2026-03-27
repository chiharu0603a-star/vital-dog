import React, { useRef } from 'react';
import { compressImage } from '../utils/image';

type Props = {
  value: string | null;
  onChange: (base64: string | null) => void;
  label?: string;
};

export function PhotoPicker({ value, onChange, label = 'しゃしん' }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    onChange(compressed);
    e.target.value = '';
  };

  return (
    <div>
      <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
        {label}
      </label>
      {value && (
        <div style={{ position: 'relative', marginBottom: 8, display: 'inline-block' }}>
          <img src={value} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              position: 'absolute', top: -6, right: -6,
              width: 20, height: 20, borderRadius: '50%',
              background: '#ef4444', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => cameraRef.current?.click()} style={btnStyle}>
          📷 カメラ
        </button>
        <button type="button" onClick={() => albumRef.current?.click()} style={btnStyle}>
          🖼️ アルバム
        </button>
      </div>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
        ※ iOSのSafariではカメラ起動に制限がある場合があります
      </p>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handle} style={{ display: 'none' }} />
      <input ref={albumRef} type="file" accept="image/*" onChange={handle} style={{ display: 'none' }} />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontSize: 13,
};
