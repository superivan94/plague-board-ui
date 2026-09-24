'use client';

import type { AnimationEvent, CSSProperties } from 'react';

import { Rat, type RatProps } from './Rat.js';

export interface RatRunProps extends Omit<RatProps, 'isRunning' | 'className'> {
  /** Da che lato entra. Da destra il ratto è ribaltato, perché il disegno guarda a destra. */
  from?: 'left' | 'right';
  /**
   * Quanto dura la traversata, in secondi. 5 come i ratti di RattInventario in modalità normale.
   *
   * ⚠️ È anche il tempo dopo cui arriva `onDone`: la traversata è un'animazione CSS e la fine la
   * dice `animationend`, non un timer — così se la scheda è in secondo piano e il browser sospende
   * le animazioni, il ratto non viene tolto prima di essere arrivato.
   */
  duration?: number;
  /** Dove passa, in verticale, dentro il contenitore: un `top` qualunque (`'40%'`, `120`). */
  top?: CSSProperties['top'];
  /** Chiamata quando il ratto è uscito dall'altra parte. Chi lo ha messo lo toglie. */
  onDone?: () => void;
  /** Classi aggiuntive sul contenitore che attraversa. */
  className?: string;
}

/**
 * **Un ratto che attraversa lo schermo**, da un lato all'altro, correndo.
 *
 * È {@link Rat} con `isRunning` dentro un contenitore che si sposta: la corsa delle zampe e la
 * traversata sono **due** animazioni, entrambe in `animations.css` — una sui pezzi del ratto, una
 * sul contenitore — e il componente ha solo la classe che le accende e l'evento che dice quando è
 * finita. Va dentro un genitore `relative` (o `fixed` a tutto schermo) con `overflow-hidden`: il
 * ratto parte fuori dal bordo sinistro e arriva oltre il destro, cioè a `100vw`.
 *
 * ⚠️ **`onDone` arriva da `animationend`**, filtrato sul nome dell'animazione della traversata: le
 * zampe emettono i loro `animationend` a ogni ciclo, e senza il filtro il ratto verrebbe tolto al
 * primo passo. Con `prefers-reduced-motion` la traversata dura un millisecondo — il ratto
 * attraversa senza farsi vedere e `onDone` arriva subito — così chi lo spawna non resta con un
 * ratto fermo a metà schermo. ⚠️ Per lo stesso motivo **chi rimette un ratto nell'`onDone` del
 * precedente lascia passare una pausa**: senza, con meno movimento la catena gira a vuoto, un
 * ratto a fotogramma.
 *
 * ⚠️ **Non decide dove né quando**: `top`, `from`, livrea e kit li sceglie chi lo mette. Il caso —
 * quanti, ogni quanto, con che cosa addosso — è il mestiere di `RatSwarm`.
 */
export function RatRun({
  from = 'left',
  duration = 5,
  top = 0,
  onDone,
  className = '',
  size = 48,
  title,
  ...rat
}: RatRunProps) {
  const onAnimationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.animationName.startsWith('pb-rat-cross')) onDone?.();
  };

  return (
    <span
      className={`pb-rat-run pb-rat-run--${from} pointer-events-none absolute left-0 block w-max ${className}`}
      style={{ top, animationDuration: `${duration}s` }}
      onAnimationEnd={onAnimationEnd}
    >
      <Rat {...rat} size={size} title={title} isRunning className={from === 'right' ? '-scale-x-100' : ''} />
    </span>
  );
}
