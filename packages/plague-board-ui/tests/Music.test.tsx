import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LUDORATTI_TRACK_URL, MusicProvider, MusicToggle, MusicVolume, useMusic } from '../src';

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
const cursore = () => screen.getByRole('slider', { name: 'Volume della musica' });

/** L'impianto completo: la traccia, l'interruttore e il cursore, ognuno dove capita. */
const conMusica = (defaultVolume?: number) =>
  render(
    <MusicProvider src="/audio/LudoRatti.mp3" defaultVolume={defaultVolume}>
      <header>
        <MusicToggle />
      </header>
      <aside>
        <MusicVolume />
      </aside>
    </MusicProvider>,
  );

describe('MusicProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('non suona niente finché non glielo si chiede', () => {
    const { play } = spiaAudio('suona');
    const { container } = conMusica();

    // ⚠️ È la riga che difende la differenza con RattInventario, dove il comando tenta l'autoplay
    // e, quando il browser lo blocca, si mette in ascolto del **primo gesto qualunque**: chi
    // clicca su un campo si ritrova la musica addosso senza averla chiesta.
    expect(play).not.toHaveBeenCalled();
    expect(comando()).toHaveAttribute('aria-pressed', 'false');

    const audio = container.querySelector('audio');
    expect(audio).toHaveAttribute('preload', 'none');
    expect(audio).toHaveAttribute('src', '/audio/LudoRatti.mp3');
    expect(audio).toHaveProperty('loop', true);
  });

  it('senza `src` monta la traccia che viaggia col pacchetto', () => {
    spiaAudio('suona');
    const { container } = render(
      <MusicProvider>
        <MusicToggle />
      </MusicProvider>,
    );

    // ⚠️ Si guarda l'**attributo**, non la proprietà: `audio.src` la risolve contro la base del
    // documento, e qui l'indirizzo è un `file://` perché fuori da un bundler `import.meta.url` è
    // il modulo stesso. Quello che il contratto promette è che il provider monti *quel* file.
    expect(container.querySelector('audio')?.getAttribute('src')).toBe(LUDORATTI_TRACK_URL);
    expect(LUDORATTI_TRACK_URL.endsWith('/assets/ludoratti.mp3')).toBe(true);
  });

  it('il file che l’indirizzo promette esiste davvero, col peso misurato', () => {
    // ⚠️ È il guard dell'unico pezzo che nessun compilatore controlla: `LUDORATTI_TRACK_URL` è un
    // `new URL(…, import.meta.url)`, e se il file venisse rinominato o perso l'espressione
    // resterebbe **valida** — `tsc` non sa che quella stringa è un percorso, e il difetto uscirebbe
    // solo come un 404 silenzioso nell'applicazione di chi installa.
    const traccia = join(process.cwd(), 'assets', 'ludoratti.mp3');

    expect(existsSync(traccia)).toBe(true);
    // E resta leggera: 1,26 MB misurati, con un margine per un giorno che la si riconverta. Sopra
    // il tetto, la decisione da rivedere è se la traccia debba ancora viaggiare col pacchetto.
    expect(statSync(traccia).size).toBeLessThan(1_500_000);
  });

  it('un `src` dichiarato vince sulla traccia del pacchetto', () => {
    spiaAudio('suona');
    const { container } = render(
      <MusicProvider src="/audio/altro.mp3">
        <MusicToggle />
      </MusicProvider>,
    );

    expect(container.querySelector('audio')).toHaveAttribute('src', '/audio/altro.mp3');
  });

  it('fuori dal provider dice che cosa manca, invece di comandare una traccia che non c’è', () => {
    const Spia = () => <p>{useMusic().volume}</p>;
    const errori = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Spia />)).toThrowError(/MusicProvider/);

    errori.mockRestore();
  });

  it('l’interruttore e il cursore comandano la stessa traccia da due punti diversi', () => {
    // ⚠️ È la ragione per cui la musica ha un provider: prima l'elemento `<audio>` viveva dentro
    // l'interruttore, e un secondo comando altrove non aveva niente da comandare.
    spiaAudio('suona');
    const { container } = conMusica(0.5);

    expect(container.querySelector('header button')).toBe(comando());
    expect(container.querySelector('aside')?.contains(cursore())).toBe(true);

    fireEvent.change(cursore(), { target: { value: '30' } });
    expect(container.querySelector('audio')).toHaveProperty('volume', 0.3);

    fireEvent.click(comando());
    expect(comando()).toHaveAttribute('aria-pressed', 'true');
    // Il volume scelto resta quello: i due comandi non si scavalcano.
    expect(container.querySelector('audio')).toHaveProperty('volume', 0.3);
  });
});

describe('MusicToggle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lo stato lo dicono gli eventi dell’elemento, non il clic', () => {
    spiaAudio('suona');
    conMusica();

    fireEvent.click(comando());
    expect(comando()).toHaveAttribute('aria-pressed', 'true');
    expect(comando()).toHaveAccessibleName('Togli la musica');

    fireEvent.click(comando());
    expect(comando()).toHaveAttribute('aria-pressed', 'false');
    expect(comando()).toHaveAccessibleName('Metti la musica');
  });

  it('se il browser rifiuta di suonare, il comando non mente', () => {
    // ⚠️ **Questo caso prova metà della riga che difende.** Che il comando non resti «premuto»
    // sopra un silenzio si vede qui; che il `catch` eviti un **rifiuto non gestito** no — jsdom
    // non lo porta da nessuna parte che un test possa guardare. Spegnendo il `catch`, questo caso
    // resta verde: è il confine del testabile, ed è dichiarato invece che supposto.
    spiaAudio('rifiuta');
    conMusica();

    fireEvent.click(comando());

    return Promise.resolve().then(() => {
      expect(comando()).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('il segno misura quanto dice `size`, anche dentro il comando di HeroUI', () => {
    spiaAudio('suona');
    const { unmount } = render(
      <MusicProvider src="/x.mp3">
        <MusicToggle size={32} />
      </MusicProvider>,
    );

    // ⚠️ L'attributo `width` non basta: `.toggle-button--sm svg` di HeroUI scrive `size-4` e lo
    // sostituisce, e misurato il 2026-09-23 il teschio era **16×16** con `size={32}` — e anche a 22,
    // la misura predefinita, che quindi non si era mai vista. La misura passa da una variabile sul
    // comando a una utility sul segno, che sta in un layer più in alto di quello di HeroUI.
    expect(comando().style.getPropertyValue('--pb-music-size')).toBe('32px');
    expect(comando().querySelector('svg')?.getAttribute('class')).toContain('size-(--pb-music-size)');
    unmount();

    render(
      <MusicProvider src="/x.mp3">
        <MusicToggle />
      </MusicProvider>,
    );
    expect(comando().style.getPropertyValue('--pb-music-size')).toBe('22px');
  });

  it('accetta altri nomi, perché le parole non sono sue', () => {
    spiaAudio('suona');
    render(
      <MusicProvider src="/x.mp3">
        <MusicToggle playLabel="Play the tune" pauseLabel="Stop the tune" />
      </MusicProvider>,
    );

    expect(comando()).toHaveAccessibleName('Play the tune');
  });
});

describe('MusicVolume', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parte dal volume dichiarato, e lo porta all’elemento', () => {
    spiaAudio('suona');
    const { container } = conMusica(0.3);

    expect(cursore()).toHaveValue('30');
    expect(container.querySelector('audio')).toHaveProperty('volume', 0.3);
  });

  it('senza un volume dichiarato parte a metà, che è come si mette una musica di fondo', () => {
    spiaAudio('suona');
    conMusica();

    expect(cursore()).toHaveValue('50');
  });

  it('un volume fuori scala si tronca invece di rompere l’elemento', () => {
    // `HTMLMediaElement.volume` lancia un `IndexSizeError` fuori da [0, 1]: è l'unico posto dove
    // un numero sbagliato non dà un difetto ma un'eccezione.
    spiaAudio('suona');
    const { container } = conMusica(7);

    expect(container.querySelector('audio')).toHaveProperty('volume', 1);
    expect(cursore()).toHaveValue('100');
  });

  it('si muove a scatti di dieci, o da tastiera servirebbero cento pressioni', () => {
    spiaAudio('suona');
    conMusica();

    expect(cursore()).toHaveAttribute('step', '10');
  });
});
