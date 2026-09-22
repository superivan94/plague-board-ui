'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Quanti pixel vale una riga, per le rotelle che contano a righe (`deltaMode` 1, Firefox). */
const LINE_PX = 16;

export interface BarRowProps {
  /** Quello che sta in riga. */
  children: ReactNode;
  /** Classi aggiuntive: è qui che si mettono la larghezza della colonna e il rientro laterale. */
  className?: string;
}

/**
 * **La riga di una barra: una sola, e se non ci sta si scorre di lato.**
 *
 * Vale per la lastra in cima e per quella in fondo, che è il motivo per cui non sta dentro
 * nessuna delle due: una barra ospita quello che le si mette, e come si comporta quel contenuto
 * quando lo spazio manca è una decisione a sé.
 *
 * ⚠️ **Andare a capo è la cosa sbagliata per una barra.** Una seconda riga cambia l'altezza della
 * lastra, e con una lastra appiccicata cambia quanto spazio resta alla pagina: quello che si
 * guadagna in leggibilità lo si paga in una pagina che si muove da sola. Meglio una riga che
 * scorre, che è anche il gesto che su un telefono si fa per istinto.
 *
 * ⚠️ **I figli non si restringono.** Dentro una flex che scorre, un figlio senza `shrink-0` viene
 * schiacciato invece di uscire dal bordo — e il traboccamento, che è la cosa che deve far apparire
 * lo scorrimento, non avviene mai. Qui la regola la mette la riga, con la variante `*:`, così chi
 * la usa non se ne deve ricordare.
 *
 * ⚠️ **Niente `tabIndex` sul contenitore, ed è una scelta.** La regola «una regione che scorre
 * dev'essere raggiungibile da tastiera» nasce per i riquadri di **testo**, dove dentro non c'è
 * niente da mettere a fuoco. Qui dentro ci sono collegamenti e comandi: il fuoco ci arriva con
 * Tab, e il browser porta in vista quello che mette a fuoco, quindi scorre lui. Un `tabIndex` in
 * più sarebbe una fermata che non serve a nessuno, su ogni pagina.
 *
 * ⚠️ **Col dito si scorre da sé; col mouse no, e la riga ci pensa.** Su un telefono una riga che
 * trabocca si trascina di lato, ed è scorrimento nativo. Col mouse invece la rotella fa scendere la
 * pagina e il trascinamento non fa niente: misurato il 2026-09-23, 736 px di voci in una riga da
 * 312 restavano irraggiungibili se non con Maiusc più rotella o col trackpad, che nessuno prova.
 * Per questo la rotella **verticale** fa scorrere la riga di lato quando la riga trabocca, e agli
 * estremi torna alla pagina, così chi scende passando sopra la barra non ci resta intrappolato. Il
 * tocco non passa di qui: il gestore ascolta solo `wheel`.
 *
 * ⚠️ **E col mouse la barra di scorrimento si vede, sottile.** È l'unico segno che la riga
 * continua, e si può afferrare. Sul telefono resta nascosta: lì il gesto è istintivo, e in una
 * lastra alta cinquanta pixel una barra di sistema si mangerebbe metà del contenuto. Il
 * `py-1 -my-1` invece è per gli anelli di fuoco: un contenitore che scorre taglia quello che esce,
 * e senza quei quattro pixel l'anello del collegamento a fuoco resterebbe mozzato sopra e sotto.
 */
export function BarRow({ children, className = '' }: BarRowProps) {
  const row = useRef<HTMLDivElement>(null);

  // ⚠️ Un ascoltatore nativo e non `onWheel`: React registra la rotella come **passiva**, e da un
  // ascoltatore passivo `preventDefault` non ferma niente — la riga scorrerebbe e la pagina pure.
  useEffect(() => {
    const element = row.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      // La rotella di lato, e Maiusc più rotella, il browser li sa già fare.
      if (event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      // Una riga che ci sta ha `max` a zero, ed è insieme all'inizio e alla fine: la rotella torna
      // alla pagina dal controllo qui sotto, senza un caso a parte.
      const max = element.scrollWidth - element.clientWidth;
      const delta =
        event.deltaMode === 1 ? event.deltaY * LINE_PX : event.deltaMode === 2 ? event.deltaY * element.clientWidth : event.deltaY;
      const atStart = element.scrollLeft <= 0;
      const atEnd = element.scrollLeft >= max - 1;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

      event.preventDefault();
      element.scrollLeft = Math.min(max, Math.max(0, element.scrollLeft + delta));
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={row}
      className={`-my-1 flex w-full min-w-0 items-center gap-x-5 overflow-x-auto py-1 scrollbar-none pointer-fine:scrollbar-thin *:shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}
