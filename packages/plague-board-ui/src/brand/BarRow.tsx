import type { ReactNode } from 'react';

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
 * ⚠️ **La barra di scorrimento è nascosta, non spenta.** `scrollbar-none` toglie il disegno ma
 * non lo scorrimento: in una lastra alta cinquanta pixel una barra di sistema si mangia la metà
 * del contenuto, e su un telefono non si vede comunque. Il `py-1 -my-1` invece è per gli anelli
 * di fuoco: un contenitore che scorre taglia quello che esce, e senza quei quattro pixel l'anello
 * del collegamento a fuoco resterebbe mozzato sopra e sotto.
 */
export function BarRow({ children, className = '' }: BarRowProps) {
  return (
    <div
      className={`-my-1 flex w-full min-w-0 items-center gap-x-5 overflow-x-auto py-1 scrollbar-none *:shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}
