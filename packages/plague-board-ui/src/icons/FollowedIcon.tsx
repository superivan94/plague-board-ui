import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il cuscinetto e i quattro polpastrelli: un'impronta di zampa.
 *
 * ⚠️ **Quattro dita, non cinque.** La zampa **anteriore** di un ratto ne ha quattro — il pollice è
 * un moncone che non lascia impronta — e la posteriore cinque. Quella che si segue è l'anteriore,
 * quindi quattro è il numero giusto ed è anche quello che tiene il segno leggibile: cinque
 * polpastrelli su 24 unità sono cinque dischi da 1,6, cioè poco più di un pixel a 16px.
 *
 * ⚠️ **I due esterni stanno più in basso e sono più piccoli** (1,95 contro 2,05): è la differenza
 * che fa leggere un ventaglio invece di una fila, e senza quella una zampa sembra una collana.
 */
const FOLLOWED_PATH =
  'M7 15.3a5 4.2 0 1 0 10 0a5 4.2 0 1 0-10 0Z' +
  'M2.55 9.4a1.95 1.95 0 1 0 3.9 0a1.95 1.95 0 1 0-3.9 0Z' +
  'M7.15 7a2.05 2.05 0 1 0 4.1 0a2.05 2.05 0 1 0-4.1 0Z' +
  'M12.75 7a2.05 2.05 0 1 0 4.1 0a2.05 2.05 0 1 0-4.1 0Z' +
  'M17.55 9.4a1.95 1.95 0 1 0 3.9 0a1.95 1.95 0 1 0-3.9 0Z';

/**
 * **Seguito.** Il gioco che si tiene d'occhio: il segno del comando che lo aggiunge ai seguiti e
 * del filtro che mostra solo quelli.
 *
 * È un'**impronta**, perché seguire qualcosa vuol dire starci sulle tracce — e l'impronta è di un
 * ratto, che è il modo in cui questa libreria dice una cosa invece di dirne una qualunque.
 *
 * ⚠️ **Di là è una faccia di topo, e qui non poteva restarlo.** In RattInventario «seguiti» è
 * l'emoji 🐭, che è una bella battuta; ma qui il ratto è già {@link RatIcon}, cioè l'**emblema**, e
 * lo stesso animale con due mestieri diversi nello stesso pacchetto è la strada per cui in
 * RattInventario sono finiti tre teschi disegnati da tre persone. L'impronta tiene la battuta e non
 * pesta i piedi al marchio.
 *
 * ⚠️ **Non è un segnalibro e non è un cuore**, e la differenza è il verbo: un segnalibro dice
 * «salvato», un cuore «preferito», l'impronta «lo sto seguendo». Sono tre stati che
 * un'applicazione può avere tutti e tre insieme.
 */
export function FollowedIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={FOLLOWED_PATH} />
    </IconBase>
  );
}
