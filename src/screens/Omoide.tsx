import React, { useState } from 'react';
import type { Dog, Log, MealTime } from '../types';
import { CategoryBadge } from '../components/CategoryBadge';
import { DogAvatar } from '../components/DogAvatar';
import { TripleToggle } from '../components/TripleToggle';
import { PhotoPicker } from '../components/PhotoPicker';
import { STO_OPTIONS, VIT_OPTIONS, APP_OPTIONS, scoreToLabel } from '../utils/options';
import type { VitalOption } from '../utils/options';

type Props = {
  dogs: Dog[];
  logs: Log[];
  onDeleteLog: (id: string) => void;
  onUpdateLog: (log: Log) => void;
};

const CAT_CONFIG = {
  honjitsu: { label: 'ほんじつ', color: '#ec4899' },
  gohan:    { label: 'ごはん',   color: '#10b981' },
  taicho:   { label: 'たいちょう', color: '#6366f1' },
};

const MEAL_OPTIONS: { label: string; value: MealTime }[] = [
  { label: 'あさ', value: 'asa' },
  { label: 'ひる', value: 'hiru' },
  { label: 'よる', value: 'yoru' },
  { label: 'おやつ', value: 'oyatsu' },
];

export function Omoide({ dogs, logs, onDeleteLog, onUpdateLog }: Props) {
  const [filterDog, setFilterDog] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [editingLog, setEditingLog] = useState<Log | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filtered = [...logs]
    .filter(l => filterDog === 'all' || l.dogId === filterDog)
    .sort((a, b) => b.id.localeCompare(a.id));

  const handleDelete = () => {
    if (!selectedLog) return;
    onDeleteLog(selectedLog.id);
    setSelectedLog(null);
    setConfirmDelete(false);
  };

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
              <button
                key={log.id}
                onClick={() => setSelectedLog(log)}
                style={{ ...cardStyle, width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
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
              </button>
            );
          })}
        </div>
      )}

      {/* 詳細モーダル */}
      {selectedLog && !editingLog && (
        <div style={overlayStyle} onClick={() => { setSelectedLog(null); setConfirmDelete(false); }}>
          <div style={sheetStyle} onClick={e => e.stopPropagation()}>
            {(() => {
              const log = selectedLog;
              const dog = dogs.find(d => d.id === log.dogId);
              const conf = CAT_CONFIG[log.category];
              return (
                <>
                  {/* ヘッダー */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    {dog && <DogAvatar dog={dog} size={32} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{dog?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.date}</div>
                    </div>
                    <CategoryBadge category={log.category} small />
                  </div>

                  {log.img && (
                    <img src={log.img} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 12, display: 'block' }} />
                  )}

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                    {log.sto !== null && <Metric label="うんち" value={log.sto} options={STO_OPTIONS} />}
                    {log.vit !== null && <Metric label="げんき" value={log.vit} options={VIT_OPTIONS} />}
                    {log.app !== null && <Metric label="たべっぷり" value={log.app} options={APP_OPTIONS} />}
                    {log.mealTime && <span style={tagStyle}>{mealLabel(log.mealTime)}</span>}
                  </div>

                  {log.vet && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0' }}>通院: {log.vet}</p>}
                  {log.note && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0 12px' }}>{log.note}</p>}

                  {/* ボタン群 */}
                  {confirmDelete ? (
                    <div>
                      <p style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>この記録を削除しますか？</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setConfirmDelete(false)} style={secondaryBtn}>キャンセル</button>
                        <button onClick={handleDelete} style={{ ...secondaryBtn, background: '#ef4444', color: '#fff', border: 'none' }}>削除</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => { setSelectedLog(null); setConfirmDelete(false); }}
                        style={secondaryBtn}
                      >
                        閉じる
                      </button>
                      <button
                        onClick={() => setEditingLog(log)}
                        style={{ ...secondaryBtn, flex: 2, background: conf.color, color: '#fff', border: 'none', fontWeight: 700 }}
                      >
                        編集する
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        style={{ ...secondaryBtn, color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        削除
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 編集フォーム */}
      {editingLog && (
        <div style={overlayStyle}>
          <div style={{ ...sheetStyle, maxHeight: '90dvh', overflowY: 'auto' }}>
            <EditLogForm
              log={editingLog}
              dogs={dogs}
              onSave={(updated) => {
                onUpdateLog(updated);
                setEditingLog(null);
                setSelectedLog(null);
              }}
              onCancel={() => {
                setEditingLog(null);
                setSelectedLog(editingLog);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── 編集フォーム ──────────────────────────────────────────
function EditLogForm({
  log,
  dogs,
  onSave,
  onCancel,
}: {
  log: Log;
  dogs: Dog[];
  onSave: (log: Log) => void;
  onCancel: () => void;
}) {
  const conf = CAT_CONFIG[log.category];
  const dog = dogs.find(d => d.id === log.dogId);

  const [sto, setSto] = useState<number | null>(log.sto);
  const [vit, setVit] = useState<number | null>(log.vit);
  const [app, setApp] = useState<number | null>(log.app);
  const [mealTime, setMealTime] = useState<MealTime | null>(log.mealTime);
  const [note, setNote] = useState(log.note);
  const [vet, setVet] = useState(log.vet ?? '');
  const [img, setImg] = useState<string | null>(log.img);

  const handleSave = () => {
    onSave({ ...log, sto, vit, app, mealTime, note, vet: log.category === 'taicho' ? vet : null, img });
  };

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {dog && <DogAvatar dog={dog} size={28} />}
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
          {dog?.name}の{conf.label}を編集
        </span>
        <CategoryBadge category={log.category} small />
      </div>

      {log.category === 'gohan' && (
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

      {log.category === 'gohan' && (
        <TripleToggle label="たべっぷり" value={app} onChange={setApp} color={conf.color} options={APP_OPTIONS} />
      )}

      {log.category !== 'gohan' && (
        <TripleToggle label="うんちの状態" value={sto} onChange={setSto} color={conf.color} options={STO_OPTIONS} />
      )}

      {log.category !== 'gohan' && (
        <TripleToggle label="げんき" value={vit} onChange={setVit} color={conf.color} options={VIT_OPTIONS} />
      )}

      {log.category === 'taicho' && (
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

      <div style={{ marginTop: 16, marginBottom: 16 }}>
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

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={secondaryBtn}>キャンセル</button>
        <button
          onClick={handleSave}
          style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: conf.color, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          保存する
        </button>
      </div>
    </div>
  );
}

// ── サブコンポーネント ──────────────────────────────────────
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

// ── スタイル ───────────────────────────────────────────────
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
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
};

const sheetStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  borderRadius: '20px 20px 0 0',
  padding: '20px 16px 32px',
  width: '100%',
  maxWidth: 480,
  border: '1px solid var(--border)',
};

const secondaryBtn: React.CSSProperties = {
  flex: 1, padding: '11px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--bg-card)',
  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14,
};

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
