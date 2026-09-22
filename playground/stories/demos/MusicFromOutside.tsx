'use client';

import { TechLabel, useMusic } from 'plague-board-ui';

/**
 * Un comando della musica scritto **da fuori**, con `useMusic` e nient'altro.
 *
 * ⚠️ È la ragione per cui la musica è un provider: chi monta la pagina deve poterla governare da
 * un punto qualunque, con un comando suo, senza passare da `MusicToggle`. Due bottoni di testo
 * bastano a provarlo — e il teschio accanto cambia stato quando si preme qui, perché i due leggono
 * lo stesso valore.
 */
export function MusicFromOutside() {
  const { isPlaying, volume, setPlaying, setVolume } = useMusic();

  return (
    <span className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setPlaying(!isPlaying)}
        className="rounded-md border border-border px-3 py-1 text-sm focus-visible:focus-ring"
      >
        {isPlaying ? 'Ferma' : 'Suona'}
      </button>
      <button
        type="button"
        onClick={() => setVolume(0.2)}
        className="rounded-md border border-border px-3 py-1 text-sm focus-visible:focus-ring"
      >
        Volume al 20%
      </button>
      <TechLabel className="text-muted">
        useMusic · {isPlaying ? 'suona' : 'ferma'} · {Math.round(volume * 100)}%
      </TechLabel>
    </span>
  );
}
