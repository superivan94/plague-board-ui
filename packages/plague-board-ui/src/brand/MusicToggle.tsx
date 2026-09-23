'use client';

import { ToggleButton } from '@heroui/react';
import type { CSSProperties } from 'react';

import { SkullPhonesIcon } from '../icons/SkullPhonesIcon.js';
import { SkullPhonesOffIcon } from '../icons/SkullPhonesOffIcon.js';
import { useMusic } from './MusicProvider.js';

export interface MusicToggleProps {
  /** Il nome del comando quando la musica **non** sta suonando. */
  playLabel?: string;
  /** Il nome del comando mentre suona. */
  pauseLabel?: string;
  /** Il lato del segno, in pixel. Il comando è largo e alto il segno più un rem. */
  size?: number;
  /** Classi aggiuntive sul comando. */
  className?: string;
}

/**
 * **L'interruttore della musica di fondo**: un teschio con le cuffie che la mette e la toglie.
 *
 * È il comando che in RattInventario sta in alto a destra della schermata di accesso. ⚠️ **Non ha
 * uno stato suo e non conosce la traccia**: legge e scrive quella di {@link MusicProvider}, che è
 * la stessa che legge {@link MusicVolume}. Così l'interruttore può stare in una barra e il cursore
 * in un menù di impostazioni, e nessuno dei due deve sapere dove sta l'altro.
 *
 * ⚠️ **Non parte da sé, e non è una dimenticanza.** Di là il comando tenta l'autoplay mezzo
 * secondo dopo il montaggio e, quando il browser lo blocca — cioè quasi sempre, perché è la regola
 * da anni — si mette in ascolto del **primo clic, tocco o tasto qualunque**. Vuol dire che chi
 * clicca su un campo per scrivere il proprio nome si ritrova la musica addosso senza averla
 * chiesta, e senza sapere che cosa l'ha accesa. Qui la musica parte quando si preme questo
 * comando, e basta.
 *
 * ⚠️ **È un `ToggleButton`, quindi porta `aria-pressed`**: la sbarra sul teschio dice «muto» a chi
 * guarda, e l'attributo lo dice a chi ascolta. Un comando che cambia solo icona è muto due volte.
 *
 * ⚠️ **E il suo `svg` HeroUI lo vuole a 16 px**, qualunque cosa dica l'attributo: `.toggle-button
 * svg` scrive `size-4`, e anche la taglia `lg` lascia il segno a 16. Misurato il 2026-09-23 —
 * `size={32}` dava un teschio di 16×16 in un bottone da 32, e la misura predefinita non si era mai
 * vista. Per questo la misura non va sull'icona come numero ma come **variabile sul comando**, che
 * una utility porta sul segno e sul bottone: le utility stanno in un layer più in alto dei
 * componenti di HeroUI, e vincono senza `!important`. Se il Tailwind di chi installa non le genera,
 * resta la misura di HeroUI — più piccola, mai rotta.
 */
export function MusicToggle({
  playLabel = 'Metti la musica',
  pauseLabel = 'Togli la musica',
  size = 22,
  className = '',
}: MusicToggleProps) {
  const { isPlaying, setPlaying } = useMusic();

  return (
    <ToggleButton
      isIconOnly
      size="sm"
      isSelected={isPlaying}
      onChange={setPlaying}
      aria-label={isPlaying ? pauseLabel : playLabel}
      // Il bottone è il segno più un rem, che è la proporzione di HeroUI: 16 px di segno in 32.
      className={`size-[calc(var(--pb-music-size)_+_1rem)] ${className}`}
      style={{ '--pb-music-size': `${size}px` } as CSSProperties}
    >
      {isPlaying ? (
        <SkullPhonesIcon size={size} className="size-(--pb-music-size)" />
      ) : (
        <SkullPhonesOffIcon size={size} className="size-(--pb-music-size)" />
      )}
    </ToggleButton>
  );
}
