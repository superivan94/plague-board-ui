import { BarRow } from './BarRow';
import type { CreditAuthor } from './CreditCard';
import { CreditLine } from './CreditLine';
import { PlagueBar } from './PlagueBar';
import type { PlagueBarSize } from './plagueBarSizes';
import { SupportButton } from './SupportButton';
import { VersionTag } from './VersionTag';

export interface PlagueFootBarProps {
  /** Chi ha fatto l'applicazione: il primo è quello che resta quando lo spazio manca. */
  authors: readonly CreditAuthor[];
  /** La versione, senza la `v`. Senza, il centro resta vuoto. */
  version?: string;
  /** La pagina delle donazioni. Senza, il comando non compare. */
  supportHref?: string;
  /** Che cosa c'è scritto sul comando delle donazioni. */
  supportLabel?: string;
  /** Le parole davanti ai nomi, con spazio e senza. */
  creditLabel?: string;
  creditShortLabel?: string;
  /** Resta attaccato in fondo mentre la pagina scorre. Vero di default. */
  isSticky?: boolean;
  /** Quanto è alto. `small` di default: un piede non è un'intestazione. */
  size?: PlagueBarSize;
  /** Classi aggiuntive sulla riga interna: è qui che si mette la larghezza della colonna. */
  rowClassName?: string;
  /** Classi aggiuntive sulla lastra. */
  className?: string;
}

/**
 * **Il piede dei Ludoratti, già montato**: la firma a sinistra, la versione al centro, le
 * donazioni a destra, tutto su una riga sola.
 *
 * ⚠️ **Questa è la via comoda, e non è l'unica.** Tutti i pezzi che monta sono pubblici —
 * {@link PlagueBar} con `placement="bottom"`, {@link BarRow}, {@link CreditLine},
 * {@link VersionTag}, {@link SupportButton} — quindi un'applicazione che vuole un piede diverso se
 * lo compone e non perde niente. Questo componente esiste perché le quattro app dei Ludoratti il
 * piede ce l'hanno **uguale**, e riscriverlo quattro volte è la copia che la libreria toglie.
 *
 * ⚠️ **Si stringe da sé, con le container query.** Sotto le 32rem restano «By:», un autore solo,
 * la versione e la sola ampolla — che è quanto basta a stare in riga su un telefono. Il
 * `@container` lo dichiara questo componente, ed è il motivo per cui i pezzi dentro sanno
 * comportarsi senza sapere dove si trovano. ⚠️ **Il contenitore è la riga, non la finestra**: lo
 * stesso piede dentro una colonna stretta si accorcia, e a tutta larghezza no — senza una sola
 * media query.
 *
 * ⚠️ **Una riga sola, e se non ci sta si scorre.** È {@link BarRow} a garantirlo: un piede che va
 * a capo cambia l'altezza della lastra, e con una lastra appiccicata cambia quanto spazio resta
 * alla pagina sotto.
 *
 * ⚠️ **Non contiene nessun testo di un'applicazione.** Autori, versione e indirizzo delle
 * donazioni arrivano da fuori; le uniche parole sue sono quelle di casa — «Creato da», «Offrimi
 * una pozione» — e anche quelle si sostituiscono.
 */
export function PlagueFootBar({
  authors,
  version,
  supportHref,
  supportLabel,
  creditLabel,
  creditShortLabel,
  isSticky = true,
  size = 'small',
  rowClassName = 'mx-auto max-w-5xl px-4',
  className = '',
}: PlagueFootBarProps) {
  return (
    <PlagueBar placement="bottom" isSticky={isSticky} size={size} className={className}>
      {/* ⚠️ `@container` qui e non più in alto: il contenitore delle query dev'essere la riga, cioè
          la cosa che davvero si stringe. Dichiararlo sulla lastra darebbe la larghezza della
          finestra anche quando la colonna dentro è stretta. */}
      <BarRow className={`@container ${rowClassName}`}>
        <CreditLine authors={authors} label={creditLabel} shortLabel={creditShortLabel} />

        {/* Il centro è un `mx-auto` fra due pezzi di larghezza diversa: non è il centro esatto
            della lastra, è il centro dello spazio che avanza — che è quello che si vede. */}
        {version && <VersionTag version={version} className="mx-auto" />}

        {supportHref && (
          <span className="ml-auto">
            <SupportButton href={supportHref} label={supportLabel} />
          </span>
        )}
      </BarRow>
    </PlagueBar>
  );
}
