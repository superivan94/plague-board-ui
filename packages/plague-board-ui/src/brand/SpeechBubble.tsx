'use client';

import { useEffect, useRef } from 'react';

export interface SpeechBubbleProps {
  /** Quello che c'è da dire, oppure `null`: il fumetto compare quando c'è una frase. */
  message: string | null;
  /**
   * Quanto resta, in millisecondi. 2500 come in RattInventario.
   *
   * ⚠️ È **anche** la durata dell'animazione, e non per comodità: `pb-bubble-pop` finisce a
   * opacità zero, quindi due durate diverse vorrebbero dire un fumetto che svanisce e resta lì
   * invisibile, o che sparisce prima di aver finito di comparire.
   *
   * ⚠️ **Zero e i negativi tornano al valore predefinito.** Non esiste un fumetto che resta per
   * sempre: uno che non se ne va non è un messaggio, è un'etichetta, e le etichette sono
   * `TechLabel`. Senza questa riga uno `0` scritto pensando «non nasconderlo» darebbe un
   * `setTimeout` a zero, cioè un fumetto che si chiude nello stesso istante in cui compare — e
   * chi ricollega `onHide` a «dì un'altra frase» ci gira dentro all'infinito.
   */
  autoHideMs?: number;
  /** Chiamata allo scadere del tempo. Chi la riceve toglie la frase. */
  onHide?: () => void;
  /** Classi aggiuntive sul contenitore: è da qui che si sposta il fumetto. */
  className?: string;
}

/**
 * **Il fumetto della mascotte.** Compare sotto a chi lo contiene, dice la sua, e se ne va da solo.
 *
 * ⚠️ **Non è un `Tooltip` di HeroUI, e la differenza è misurata** (2026-09-17, con una sonda poi
 * cancellata). Pilotarlo con `isOpen` funziona, ma quello che produce nel DOM è
 * `role="tooltip"` legato al grilletto con **`aria-describedby`**: la frase diventa la
 * *descrizione permanente* di chi la dice, riannunciata a ogni fuoco. «Squit!» non descrive il
 * ratto — è una cosa che il ratto dice, una volta. E il contenuto finisce in un contenitore di
 * sovrapposizione fuori dall'albero, mentre questo fumetto sta appeso a chi parla e si muove con
 * lui. Qui il ruolo giusto è `status`: una regione viva che si legge quando arriva.
 *
 * ⚠️ **La regione viva nasce prima del contenuto.** Il contenitore c'è sempre, anche senza frase,
 * perché una regione che compare già piena può non essere annunciata affatto.
 *
 * ⚠️ **Il fumetto non si clicca.** Di là era un `role="button"` con `aria-label="Chiudi
 * messaggio"` addosso a tutto: quel nome sostituisce il contenuto, e la frase — l'unica cosa che
 * il fumetto esiste per dire — restava fuori dal nome accessibile. Un messaggio che se ne va da
 * sé non ha bisogno di un comando per chiuderlo.
 */
const DEFAULT_AUTO_HIDE_MS = 2500;

export function SpeechBubble({
  message,
  autoHideMs: autoHideMsProp = DEFAULT_AUTO_HIDE_MS,
  onHide,
  className = '',
}: SpeechBubbleProps) {
  const autoHideMs = autoHideMsProp > 0 ? autoHideMsProp : DEFAULT_AUTO_HIDE_MS;

  // ⚠️ La callback si legge da un riferimento, e l'effetto **non** la mette fra le dipendenze: chi
  // usa il componente scrive `onHide={() => setFrase(null)}`, cioè una funzione nuova a ogni
  // render, e il conto alla rovescia ripartirebbe da capo ogni volta. Con un genitore che si
  // ridisegna spesso, il fumetto non si chiuderebbe mai.
  const onHideRef = useRef(onHide);
  useEffect(() => {
    onHideRef.current = onHide;
  });

  useEffect(() => {
    if (message === null) return;

    const timer = setTimeout(() => onHideRef.current?.(), autoHideMs);
    return () => clearTimeout(timer);
  }, [message, autoHideMs]);

  return (
    <span
      role="status"
      className={`pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${className}`}
    >
      {message !== null && (
        <span
          // ⚠️ Niente `whitespace-nowrap`, che di là stava **insieme** a `max-w-xs`: sono due
          // istruzioni contrarie, e vince la seconda — il fumetto sfonda la larghezza massima
          // invece di andare a capo. Misurato: «Sssh... sto organizzando la prossima scorribanda!»
          // viene 350px, cioè più larga della scheda che la contiene e più di un telefono stretto.
          className="animate-bubble-pop relative block w-max max-w-xs rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-800 shadow-lg"
          style={{ animationDuration: `${autoHideMs}ms` }}
        >
          {/* La codina, con la tecnica del bordo: due triangoli sovrapposti, quello dietro più
              grande di un pixel per far vedere il filo del contorno. */}
          <span className="absolute -top-3 left-1/2 block size-0 -translate-x-1/2 border-x-[9px] border-b-[9px] border-x-transparent border-b-gray-300" />
          <span className="absolute -top-2 left-1/2 block size-0 -translate-x-1/2 border-x-[8px] border-b-[8px] border-x-transparent border-b-white" />
          {message}
        </span>
      )}
    </span>
  );
}
