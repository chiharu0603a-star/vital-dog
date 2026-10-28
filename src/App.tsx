import React, { useEffect, useState } from 'react';
import { useStore } from './hooks/useStore';
import { storage } from './utils/storage';
import { Yousu } from './screens/Yousu';
import { Kiroku } from './screens/Kiroku';
import { Omoide } from './screens/Omoide';
import { Settei } from './screens/Settei';
import { DogForm } from './screens/DogForm';
import { Onboarding } from './screens/Onboarding';
import type { Dog, Tab } from './types';

export default function App() {
  const { dogs, logs, settings, saveDog, deleteDog, saveLog, deleteLog, saveSettings } = useStore();
  const [tab, setTab] = useState<Tab>('yousu');
  const [editingDog, setEditingDog] = useState<Dog | null | undefined>(undefined);
  const [onboarded, setOnboarded] = useState(() => storage.isOnboarded());
  const [navDogId, setNavDogId] = useState<string | null>(() => storage.getNavDogId());

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [settings.theme]);

  const handleChangeNavDog = (id: string) => {
    setNavDogId(id);
    storage.saveNavDogId(id);
  };

  // ナビに表示する犬: 選択済み > 先頭の犬 > null
  const navDog = dogs.find(d => d.id === navDogId) ?? dogs[0] ?? null;

  // Onboarding
  if (!onboarded) {
    return (
      <Onboarding
        onComplete={(dog) => {
          saveDog(dog);
          storage.setOnboarded();
          setOnboarded(true);
        }}
      />
    );
  }

  // Dog edit screen
  if (editingDog !== undefined) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <DogForm
          initial={editingDog ?? undefined}
          onSave={saveDog}
          onDelete={deleteDog}
          onBack={() => setEditingDog(undefined)}
        />
      </div>
    );
  }

  const tabList: { id: Tab; label: string }[] = [
    { id: 'yousu',  label: 'ようす'  },
    { id: 'kiroku', label: 'きろく'  },
    { id: 'omoide', label: 'おもいで' },
    { id: 'settei', label: 'せってい' },
  ];

  const staticIcons: Record<string, string> = {
    kiroku: '✏️',
    omoide: '📷',
    settei: '⚙️',
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
        {tab === 'yousu' && <Yousu dogs={dogs} logs={logs} />}
        {tab === 'kiroku' && <Kiroku dogs={dogs} onSave={saveLog} />}
        {tab === 'omoide' && <Omoide dogs={dogs} logs={logs} onDeleteLog={deleteLog} onUpdateLog={saveLog} />}
        {tab === 'settei' && (
          <Settei
            dogs={dogs}
            settings={settings}
            navDogId={navDog?.id ?? null}
            onEditDog={(d) => setEditingDog(d)}
            onSaveSettings={saveSettings}
            onChangeNavDog={handleChangeNavDog}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <nav style={navStyle}>
        {tabList.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.15s',
            }}
          >
            {t.id === 'yousu'
              ? <NavDogIcon dog={navDog} active={tab === 'yousu'} />
              : <span style={{ fontSize: 22 }}>{staticIcons[t.id]}</span>
            }
            <span style={{ fontSize: 10, marginTop: 2, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            {tab === t.id && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', marginTop: 2 }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

function NavDogIcon({ dog, active }: { dog: Dog | null; active: boolean }) {
  const size = 26;
  const borderColor = active ? 'var(--accent)' : 'var(--text-muted)';

  if (dog?.photo) {
    return (
      <img
        src={dog.photo}
        alt={dog.name}
        style={{
          width: size, height: size, borderRadius: '50%', objectFit: 'cover',
          border: `2px solid ${borderColor}`,
        }}
      />
    );
  }

  const bg = dog?.color ?? '#888';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      border: `2px solid ${borderColor}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: size * 0.6, height: size * 0.6 }}>
        <path d="M4.5 11.5c0-1.5.5-2.5 1.5-3.5L7 7V5.5C7 4.5 7.5 4 8.5 4H10c.5 0 1 .2 1.3.6L12 6h1l1-1.5c.5-.5 1-.5 1.5-.5s1 .5 1.5 1L18 7c.5.5.5 1 .5 1.5V9l.5.5c.5 1 .5 2 0 3l-.5 1v3.5c0 .5-.5 1-1 1h-1c-.5 0-1-.5-1-1V16h-5v1c0 .5-.5 1-1 1H8.5c-.5 0-1-.5-1-1v-3.5l-.5-1c-.5-.5-.5-1-.5-1.5v-.5z"/>
      </svg>
    </div>
  );
}

const navStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  background: 'var(--bg-nav)',
  borderTop: '1px solid var(--border)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  zIndex: 50,
};
