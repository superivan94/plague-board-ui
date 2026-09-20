import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MusicToggle } from '../src';

/**
 * jsdom non sa suonare: `HTMLMediaElement.play` **non è implementato** e lanciare è tutto quello
 * che fa. Si sostituisce con una spia che restituisce una promessa, che è il contratto vero — ed
 * è anche l'unico modo di provare il caso che conta, cioè il rifiuto.
 */
const spiaAudio = (esito: 'suona' | 'rifiuta') => {
  const play = vi.fn(function (this: HTMLAudioElement) {
    if (esito === 'rifiuta') return Promise.reject(new Error('NotAllowedError'));
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  const pause = vi.fn(function (this: HTMLAudioElement) {
    this.dispatchEvent(new Event('pause'));
  });

  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause);

  return { play, pause };
};

const comando = () => screen.getByRole('button');

describe('MusicToggle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('non suona niente finché non glielo si chiede', () => {
    const { play } = spiaAudio('suona');
    const { container } = render(<MusicToggle src="/audio/LudoRatti.mp3" />);

    // ⚠️ È la riga che difende la differenza con RattInventario, dove il comando tenta l'autoplay
    // e, quando il browser lo blocca, si mette in ascolto del **primo gesto qualunque**: chi
    // clicca su un campo si ritrova la musica addosso senza averla chiesta.
    expect(play).not.toHaveBeenCalled();
    expect(comando()).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelector('audio')).toHaveAttribute('preload', 'none');
  });

  it('alla pressione suona in ciclo la traccia che le è stata data', () => {
    const { play } = spiaAudio('suona');
    const { container } = render(<MusicToggle src="/audio/LudoRatti.mp3" />);

    fireEvent.click(comando());

    expect(play).toHaveBeenCalledOnce();
    const audio = container.querySelector('audio');
    expect(audio).toHaveAttribute('src', '/audio/LudoRatti.mp3');
    expect(audio).toHaveProperty('loop', true);
  });

  it('lo stato lo dicono gli eventi dell’elemento, non il clic', () => {
    spiaAudio('suona');
    render(<MusicToggle src="/audio/LudoRatti.mp3" />);

    fireEvent.click(comando());
    expect(comando()).toHaveAttribute('aria-pressed', 'true');
    expect(comando()).toHaveAccessibleName('Togli la musica');

    fireEvent.click(comando());
    expect(comando()).toHaveAttribute('aria-pressed', 'false');
    expect(comando()).toHaveAccessibleName('Metti la musica');
  });

  it('se il browser rifiuta di suonare, il comando non mente', () => {
    // ⚠️ Senza il `catch`, quel rifiuto è un errore non gestito; e senza rimettere lo stato a
    // spento, il comando resterebbe «premuto» sopra un silenzio.
    spiaAudio('rifiuta');
    render(<MusicToggle src="/audio/LudoRatti.mp3" />);

    fireEvent.click(comando());

    return Promise.resolve().then(() => {
      expect(comando()).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('accetta altri nomi, perché le parole non sono sue', () => {
    spiaAudio('suona');
    render(<MusicToggle src="/x.mp3" playLabel="Play the tune" pauseLabel="Stop the tune" />);

    expect(comando()).toHaveAccessibleName('Play the tune');
  });

  it('porta il volume all’elemento, invece di lasciarlo al massimo', () => {
    spiaAudio('suona');
    const { container } = render(<MusicToggle src="/x.mp3" volume={0.3} />);

    expect(container.querySelector('audio')).toHaveProperty('volume', 0.3);
  });
});
