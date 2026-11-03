import { useState } from 'react';
import { Button, SoundProvider } from './components';
import { DocumentationIntro, DocumentationSection, DocumentationShell } from './docs/Documentation';
import { docOrder } from './docs/catalog';

function SpeakerGlyph({ enabled }: { enabled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 9v6h4l5 4V5L8 9zm12.5-.5a5 5 0 0 1 0 7m2.5-9.5a9 9 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {!enabled ? (
        <path
          d="m16 9 5 6m0-6-5 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <SoundProvider enabled={soundEnabled} volume={0.38}>
      <DocumentationShell actions={
        <Button
          variant={soundEnabled ? 'primary' : 'secondary'}
          size="sm"
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? '关闭交互音效' : '开启交互音效'}
          leadingIcon={<SpeakerGlyph enabled={soundEnabled} />}
          onClick={() => setSoundEnabled(enabled => !enabled)}
        >
          {soundEnabled ? 'SOUND ON' : 'SOUND OFF'}
        </Button>
      }>
        <DocumentationIntro />
        {docOrder.map(id => <DocumentationSection key={id} id={id} />)}
      </DocumentationShell>
    </SoundProvider>
  );
}
