'use client';

import { ToggleButton } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

import { SkullPhonesIcon } from '../icons/SkullPhonesIcon';
import { SkullPhonesOffIcon } from '../icons/SkullPhonesOffIcon';

export interface MusicToggleProps {
  /**
   * La traccia da suonare.
   *
   * ⚠️ **Il file non viaggia col pacchetto**, ed è una scelta: `LudoRatti.mp3` pesa **2,1 MB** —
   * cento volte il resto della libreria messo insieme — e sarebbe scaricato da chiunque installi
   * il pacchetto, anche da chi la musica non la vuole. Lo serve l'applicazione dalla sua cartella
   * pubblica, e qui arriva come indirizzo.
   */
  src: string;
  /** Il nome del comando quando la musica **non** sta suonando. */
  playLabel?: string;
  /** Il nome del comando mentre suona. */
  pauseLabel?: string;
  /** Il volume, da 0 a 1. Lo decide chi monta il comando: una musica di fondo non parte al massimo. */
  volume?: number;
  /** Il lato del segno, in pixel. */
  size?: number;
  /** Classi aggiuntive sul comando. */
  className?: string;
}

/**
 * **La musica di fondo, con l'interruttore per spegnerla.**
 *
 * È il comando che in RattInventario sta in alto a destra della schermata di accesso: un teschio
 * con le cuffie che fa partire `LudoRatti.mp3` in ciclo.
 *
 * ⚠️ **Non parte da sé, e non è una dimenticanza.** Di là il comando tenta l'autoplay mezzo
 * secondo dopo il montaggio e, quando il browser lo blocca — cioè quasi sempre, perché è la regola
 * da anni — si mette in ascolto del **primo clic, tocco o tasto qualunque** e fa partire la musica
 * lì. Vuol dire che chi clicca su un campo per scrivere il proprio nome si ritrova la musica
 * addosso senza averla chiesta, e senza sapere che cosa l'ha accesa. Qui la musica parte quando si
 * preme questo comando, e basta.
 *
 * ⚠️ **La traccia non si scarica finché non serve** (`preload="none"`): sono 2,1 MB, e chi non
 * preme non li paga. Il prezzo dichiarato è che alla prima pressione c'è un istante di attesa.
 *
 * ⚠️ **È un `ToggleButton`, quindi porta `aria-pressed`**: la sbarra sul teschio dice «muto» a chi
 * guarda, e l'attributo lo dice a chi ascolta. Un comando che cambia solo icona è muto due volte.
 */
export function MusicToggle({
  src,
  playLabel = 'Metti la musica',
  pauseLabel = 'Togli la musica',
  volume = 0.5,
  size = 22,
  className = '',
}: MusicToggleProps) {
  const traccia = useRef<HTMLAudioElement>(null);
  const [suona, setSuona] = useState(false);

  useEffect(() => {
    if (traccia.current) traccia.current.volume = Math.min(1, Math.max(0, volume));
  }, [volume]);

  const commuta = (acceso: boolean) => {
    const audio = traccia.current;
    if (!audio) return;

    if (!acceso) {
      audio.pause();
      return;
    }

    // ⚠️ `play()` restituisce una promessa che **può essere rifiutata** — il browser blocca
    // l'audio finché non c'è stato un gesto, e qui il gesto c'è, ma il file potrebbe anche non
    // caricarsi. Senza il `catch`, quel rifiuto diventa un errore non gestito in console; e lo
    // stato non si scrive qui ma negli eventi dell'elemento, che sono l'unica verità su ciò che
    // sta suonando davvero.
    void audio.play().catch(() => setSuona(false));
  };

  return (
    <>
      {/* ⚠️ L'elemento sta nel DOM e non è un `new Audio()`: così è React a montarlo e smontarlo,
          e una pagina che cambia non lascia una traccia che suona nel vuoto. */}
      <audio
        ref={traccia}
        src={src}
        loop
        preload="none"
        onPlay={() => setSuona(true)}
        onPause={() => setSuona(false)}
      />

      <ToggleButton
        isIconOnly
        size="sm"
        isSelected={suona}
        onChange={commuta}
        aria-label={suona ? pauseLabel : playLabel}
        className={className}
      >
        {suona ? <SkullPhonesIcon size={size} /> : <SkullPhonesOffIcon size={size} />}
      </ToggleButton>
    </>
  );
}
