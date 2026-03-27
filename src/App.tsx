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

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [settings.theme]);

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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'yousu',  label: 'ようす',  icon: '🏠' },
    { id: 'kiroku', label: 'きろく',  icon: '✏️' },
    { id: 'omoide', label: 'おもいで', icon: '📷' },
    { id: 'settei', label: 'せってい', icon: '⚙️' },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
        {tab === 'yousu' && <Yousu dogs={dogs} logs={logs} />}
        {tab === 'kiroku' && <Kiroku dogs={dogs} onSave={saveLog} />}
        {tab === 'omoide' && <Omoide dogs={dogs} logs={logs} onDeleteLog={deleteLog} />}
        {tab === 'settei' && (
          <Settei
            dogs={dogs}
            settings={settings}
            onEditDog={(d) => setEditingDog(d)}
            onSaveSettings={saveSettings}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <nav style={navStyle}>
        {tabs.map(t => (
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
            <span style={{ fontSize: 22 }}>{t.icon}</span>
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
