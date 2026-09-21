'use client';

import { ToggleButton } from '@heroui/react';

import { SkullPhonesIcon } from '../icons/SkullPhonesIcon.js';
import { SkullPhonesOffIcon } from '../icons/SkullPhonesOffIcon.js';
import { useMusic } from './MusicProvider.js';

export interface MusicToggleProps {
  /** Il nome del comando quando la musica **non** sta suonando. */
  playLabel?: string;
  /** Il nome del comando mentre suona. */
  pauseLabel?: string;
  /** Il lato del segno, in pixel. */
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
      className={className}
    >
      {isPlaying ? <SkullPhonesIcon size={size} /> : <SkullPhonesOffIcon size={size} />}
    </ToggleButton>
  );
}
