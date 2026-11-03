import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useAssetUrl } from '../assets/AssetProvider';

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
  const assetUrl = useAssetUrl();
  const sources = useMemo(
    () => ({ ...DEFAULT_SOUNDS, ...sounds }),
    [sounds],
  );

  const play = useCallback(
    (sound: InteractionSound) => {
      if (!enabled || typeof Audio === 'undefined') {
        return;
      }

      try {
        const audio = new Audio(assetUrl(sources[sound]));
        audio.volume = Math.min(1, Math.max(0, volume));
        void audio.play()?.catch(() => undefined);
      } catch {
        // Audio feedback is optional and must never block an interaction.
      }
    },
    [enabled, sources, volume, assetUrl],
  );

  const value = useMemo(() => ({ enabled, play }), [enabled, play]);

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useInteractionSound() {
  return useContext(SoundContext);
}
