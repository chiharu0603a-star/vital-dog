import { useState } from 'react';

type Props = { onBack: () => void };

type Item = { q: string; a: string };

const HELP_ITEMS: Item[] = [
  {
    q: 'きろくのしかた',
    a: `「きろく」タブには3つのカテゴリがあります。\n\n` +
       `🐾 ほんじつ … うんちのようすとげんきを記録します。毎日つけるとメーターが動きます。\n\n` +
       `🍚 ごはん … たべっぷりといつのごはんかを記録します。\n\n` +
       `💊 たいちょう … 通院や体調の変化を獣医師むけにメモします。メーターには反映されません。`,
  },
  {
    q: 'メーターのみかた',
    a: `「ようす」画面のメーターは、直近3日分の「ほんじつ」記録の平均をもとに計算しています。\n\n` +
       `まだ記録が少ないときはメーターが動かないことがあります。毎日つづけると変化がわかるようになります。\n\n` +
       `「たいちょう」カテゴリの記録はメーターに反映されません。`,
  },
  {
    q: 'しゃしんがとれないとき',
    a: `iOSのSafariではカメラへのアクセスに制限がある場合があります。\n\n` +
       `📷 カメラが使えないときは「アルバムから選ぶ」を試してみてください。\n\n` +
       `設定アプリ → Safari → カメラ、の順に進んで「許可」にすると使えるようになることがあります。`,
  },
  {
    q: 'データについて',
    a: `記録したデータはすべてこのスマホの中にだけ保存されています。\n\n` +
       `⚠️ アプリを削除すると、データもいっしょに消えてしまいます。\n\n` +
       `大切な記録は「ようす」画面のレポート機能でスクリーンショットを残しておくことをおすすめします。`,
  },
  {
    q: '獣医師にみせるには',
    a: `「ようす」画面の下のほうに「🏥 診察用レポート」ボタンがあります。\n\n` +
       `タップすると、直近の記録をまとめた画面が表示されます。そのまま獣医師にスマホを見せることができます。\n\n` +
       `スクリーンショットを撮って送ることもできます。`,
  },
];

export function Help({ onBack }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i));

  return (
    <div style={{ padding: 16, paddingBottom: 48 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22, padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: 20, color: 'var(--text-primary)' }}>ヘルプ</h2>
      </div>

      {/* アコーディオン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HELP_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 12,
              border: `1px solid ${open === i ? 'var(--accent)' : 'var(--border)'}`,
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.q}
              </span>
              <span
                style={{
                  fontSize: 18, color: 'var(--text-muted)',
                  transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  display: 'inline-block',
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                ˅
              </span>
            </button>

            {open === i && (
              <div style={{ padding: '0 16px 16px' }}>
                <div style={{ width: '100%', height: 1, background: 'var(--border)', marginBottom: 12 }} />
                {item.a.split('\n\n').map((para, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      margin: j > 0 ? '10px 0 0' : '0',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 32 }}>
        わからないことは記録を続けながら試してみてね 🐾
      </p>
    </div>
  );
}
