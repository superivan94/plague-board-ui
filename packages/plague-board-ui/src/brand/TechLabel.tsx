import type { ReactNode } from 'react';

export interface TechLabelProps {
  children: ReactNode;
  /** Classi aggiuntive: il colore si mette da qui, per esempio `text-brand-ink`. */
  className?: string;
}

/**
 * **L'etichetta di servizio.** Caratteri fissi, maiuscoletto spaziato, corpo piccolo: è la voce
 * con cui i Ludoratti scrivono le cose che la macchina dice di sé — «rete della peste»,
 * «ceppo sperimentale», «livello tossico: nominale».
 *
 * Non è un titolo e non è un paragrafo: è la riga di stato di un impianto. Su `ludoratti.it` è il
 * `Share Tech Mono` dei titoli e del piede; qui è l'unico posto in cui quel registro è definito,
 * così non si ricompone a mano ogni volta con tre classi diverse.
 *
 * ⚠️ **Il maiuscolo è CSS, non testo.** Il contenuto resta come lo si scrive: trasformarlo in
 * JavaScript romperebbe la ricerca nella pagina e quello che finisce negli appunti.
 *
 * ⚠️ **Il carattere lo carica l'applicazione**, non la libreria: un pacchetto di componenti che
 * imponesse un font lo imporrebbe a quattro app insieme. Qui si chiede `font-mono`, e quale sia
 * lo decide chi installa — i Ludoratti usano `Share Tech Mono`.
 */
export function TechLabel({ children, className = '' }: TechLabelProps) {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${className}`}>
      {children}
    </span>
  );
}
