import { EmptyState } from '@heroui/react';
import type { ReactNode } from 'react';

import { LUDORATTI_COPY } from '../data/copy.js';
import { RatMascot } from './RatMascot.js';

/** I livelli che un titolo di stato vuoto può avere: sotto a un `h1`, mai al suo posto. */
export type PlagueEmptyStateHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface PlagueEmptyStateProps {
  /** Che cosa manca. Di serie la voce `empty` del lessico di casa. */
  title?: ReactNode;
  /** La riga sotto il titolo: perché è vuoto, o che cosa si può fare. Senza, non resta niente. */
  description?: ReactNode;
  /** Il comando che riempie il vuoto — «Nuovo manuale», «Aggiungi un gioco». */
  action?: ReactNode;
  /**
   * Il disegno sopra il titolo. Di serie la mascotte con l'ampolla; un'altra illustrazione la
   * sostituisce, e `null` la toglie.
   */
  illustration?: ReactNode;
  /**
   * Il livello del titolo. ⚠️ Lo sceglie chi monta perché dipende dalla pagina: un vuoto dentro
   * una sezione che ha già il suo `h2` vuole un `h3`, e un salto di livello a schermo non si vede.
   */
  headingLevel?: PlagueEmptyStateHeadingLevel;
  /** Classi aggiuntive sul contenitore. */
  className?: string;
}

/**
 * **Il vuoto dei Ludoratti**: la mascotte con l'ampolla, il titolo, una riga e il comando che lo
 * riempie (utente, 2026-09-23). Al posto delle righe di testo grigio che le due applicazioni
 * mostrano oggi quando una lista non ha niente dentro.
 *
 * Sopra `EmptyState` di HeroUI, che porta la spaziatura e il colore del testo secondario; la forma
 * — il disegno in cima, tutto centrato — è nostra.
 *
 * ⚠️ **La mascotte è decorativa**: ha l'`alt` vuoto, e a dire che non c'è niente è il titolo. Con
 * un nome suo verrebbe annunciata per prima, e direbbe «ratto con l'ampolla» a chi voleva sapere
 * che la lista è vuota.
 *
 * ⚠️ **Resta un componente server**: il disegno è una stringa di 26 KB, e da qui finisce
 * nell'HTML una volta sola invece che nel JavaScript di chi lo monta.
 *
 * @example
 * ```tsx
 * <PlagueEmptyState
 *   title="Nessun manuale"
 *   description="Crea il primo, o importalo da Notion."
 *   action={<Button onPress={crea}>Nuovo manuale</Button>}
 * />
 * ```
 */
export function PlagueEmptyState({
  title = LUDORATTI_COPY.empty.house,
  description,
  action,
  illustration,
  headingLevel = 2,
  className = '',
}: PlagueEmptyStateProps) {
  const Titolo = `h${headingLevel}` as const;

  return (
    <EmptyState className={`flex flex-col items-center gap-3 py-8 text-center ${className}`}>
      {illustration === undefined ? <RatMascot size={96} /> : illustration}
      <Titolo className="font-mono text-base text-foreground">{title}</Titolo>
      {description ? <p className="max-w-sm">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </EmptyState>
  );
}
