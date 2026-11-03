import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../components/Button/Button';
import { SoundProvider } from './SoundProvider';

class MockAudio {
  static instances: MockAudio[] = [];
  src: string;
  volume = 1;
  play = vi.fn(() => Promise.resolve());

  constructor(src: string) {
    this.src = src;
    MockAudio.instances.push(this);
  }
}

describe('SoundProvider', () => {
  beforeEach(() => {
    MockAudio.instances = [];
    vi.stubGlobal('Audio', MockAudio);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is muted by default', () => {
    render(
      <SoundProvider>
        <Button>Continue</Button>
      </SoundProvider>,
    );

    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(MockAudio.instances).toHaveLength(0);
  });

  it('plays feedback only after explicit enablement', () => {
    render(
      <SoundProvider enabled volume={0.5}>
        <Button>Continue</Button>
      </SoundProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(MockAudio.instances).toHaveLength(1);
    expect(MockAudio.instances[0]?.volume).toBe(0.5);
    expect(MockAudio.instances[0]?.play).toHaveBeenCalledOnce();
  });

  it('does not block interaction when audio playback fails', () => {
    MockAudio.prototype.play = vi.fn(() => Promise.reject(new Error('blocked')));
    const onClick = vi.fn();
    render(
      <SoundProvider enabled>
        <Button onClick={onClick}>Continue</Button>
      </SoundProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
