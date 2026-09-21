'use client';

import { Slider } from '@heroui/react';

import { useMusic } from './MusicProvider.js';

export interface MusicVolumeProps {
  /** Come si chiama il cursore per chi non lo vede. */
  label?: string;
  /**
   * Di quanto si sposta a ogni scatto, in percento.
   *
   * ⚠️ **Dieci e non uno.** Da tastiera il cursore si muove di un passo per freccia: con l'uno
   * servono cento pressioni per andare da un capo all'altro, e un volume non ha cento valori
   * distinguibili.
   */
  step?: number;
  /** Classi aggiuntive sul cursore. */
  className?: string;
}

/**
 * **Il cursore del volume della musica di fondo.**
 *
 * ⚠️ **Non ha uno stato suo**: legge e scrive quello di {@link MusicProvider}, lo stesso che legge
 * {@link MusicToggle}. È l'intera ragione per cui la musica ha un provider — senza, l'elemento
 * `<audio>` vivrebbe dentro l'interruttore e questo cursore non avrebbe niente da comandare.
 *
 * ⚠️ **Il volume sta da 0 a 1 nel provider e da 0 a 100 qui.** Il primo è il numero che vuole
 * l'elemento `<audio>`, il secondo è quello che una persona legge: la conversione sta in un punto
 * solo, ed è questo.
 *
 * ⚠️ **Non si nasconde quando la musica è ferma**, al contrario di RattInventario, dove il cursore
 * compare solo mentre suona. Un comando che appare e sparisce sposta quello che gli sta accanto, e
 * costringe ad accendere la musica per scoprire che il volume si può abbassare prima. Chi lo vuole
 * nascosto lo monta sotto la sua condizione: è una decisione della pagina, non del componente.
 */
export function MusicVolume({ label = 'Volume della musica', step = 10, className = '' }: MusicVolumeProps) {
  const { volume, setVolume } = useMusic();

  return (
    <Slider
      aria-label={label}
      value={Math.round(volume * 100)}
      minValue={0}
      maxValue={100}
      step={step}
      onChange={(valore) => setVolume((Array.isArray(valore) ? valore[0] : valore) / 100)}
      className={className}
    >
      {/* ⚠️ I tre pezzi vanno scritti: `Slider` da solo rende un `<div role="group">` **vuoto** —
          nessuna traccia, nessun `<input type="range">`, quindi niente da afferrare e niente da
          annunciare. Misurato sul DOM il 2026-09-20. */}
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}
