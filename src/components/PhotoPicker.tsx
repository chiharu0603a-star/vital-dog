import React, { useRef, useState } from 'react';
import { compressImage, dataUrlStorageBytes } from '../utils/image';
import { getAvailableBytes, formatBytes } from '../utils/storage';

type Props = {
  value: string | null;
  onChange: (base64: string | null) => void;
  label?: string;
};

export function PhotoPicker({ value, onChange, label = 'しゃしん' }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 空き容量の見積もり（差し替えの場合は今の写真の分は空く）
      const available =
        getAvailableBytes() + (value ? dataUrlStorageBytes(value) : 0);
      let compressed = await compressImage(file);
      if (dataUrlStorageBytes(compressed) > available) {
        // 通常の圧縮では入りきらないので、空きに合わせてさらに小さく圧縮する
        compressed = await compressImage(file, Math.max(20 * 1024, Math.floor(available * 0.35)));
      }
      if (dataUrlStorageBytes(compressed) > available) {
        setError(
          `保存容量が足りないため、この写真は追加できません（空きは約${formatBytes(getAvailableBytes())}です）。古い写真を削除してからお試しください。`,
        );
        e.target.value = '';
        return;
      }
      setError(null);
      onChange(compressed);
    } catch {
      setError('写真の読み込みに失敗しました。別の写真でお試しください。');
    }
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
      {error && (
        <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, lineHeight: 1.5 }}>{error}</p>
      )}
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
