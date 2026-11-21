import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { usePreferredAsset } from '../assets/AssetProvider';

export type InteractionSound = 'hover' | 'leave' | 'press' | 'click';

export type SoundSources = Record<InteractionSound, string>;

export interface SoundProviderProps {
  children: ReactNode;
  enabled?: boolean;
  volume?: number;
  sounds?: Partial<SoundSources>;
}

interface SoundContextValue {
  enabled: boolean;
  play: (sound: InteractionSound) => void;
}

const DEFAULT_SOUNDS: SoundSources = {
  hover: '/assets/doors/audio/hover.mp3',
  leave: '/assets/doors/audio/leave.mp3',
  press: '/assets/doors/audio/click.mp3',
  click: '/assets/doors/audio/click.mp3',
};

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  play: () => undefined,
});

export function SoundProvider({
  children,
  enabled = false,
  volume = 0.42,
  sounds,
}: SoundProviderProps) {
  const hover = usePreferredAsset(enabled ? sounds?.hover ?? DEFAULT_SOUNDS.hover : undefined, 'audio');
  const leave = usePreferredAsset(enabled ? sounds?.leave ?? DEFAULT_SOUNDS.leave : undefined, 'audio');
  const press = usePreferredAsset(enabled ? sounds?.press ?? DEFAULT_SOUNDS.press : undefined, 'audio');
  const click = usePreferredAsset(enabled ? sounds?.click ?? DEFAULT_SOUNDS.click : undefined, 'audio');

  const play = useCallback(
    (sound: InteractionSound) => {
      if (!enabled || typeof Audio === 'undefined') {
        return;
      }

      try {
        const { url, fallback } = { hover, leave, press, click }[sound];
        if (!url) return;
        const audio = new Audio(url);
        audio.volume = Math.min(1, Math.max(0, volume));
        if (fallback && fallback !== url) {
          audio.addEventListener('error', () => {
            audio.src = fallback;
            void audio.play()?.catch(() => undefined);
          }, { once: true });
        }
        void audio.play()?.catch(() => undefined);
      } catch {
        // Audio feedback is optional and must never block an interaction.
      }
    },
    [enabled, hover, leave, press, click, volume],
  );

  const value = useMemo(() => ({ enabled, play }), [enabled, play]);

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useInteractionSound() {
  return useContext(SoundContext);
}
