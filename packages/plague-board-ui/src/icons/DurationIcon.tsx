import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * La cassa: un disco forato da un disco più piccolo, cioè un anello largo 2,4 unità.
 *
 * ⚠️ **Il quadrante è un buco, non un disco del colore della pagina** — stessa regola dei punti del
 * dado e delle bolle dell'ampolla. Un disco dipinto sarebbe giusto in chiaro, sbagliato in scuro e
 * sbagliato due volte dentro una pastiglia colorata.
 */
const DURATION_CASE =
  'M4.7 14.5a7.3 7.3 0 1 0 14.6 0a7.3 7.3 0 1 0-14.6 0Z' +
  'M7.1 14.5a4.9 4.9 0 1 0 9.8 0a4.9 4.9 0 1 0-9.8 0Z';

/**
 * La corona sopra e le due lancette dentro, in un tracciato che **somma**.
 *
 * ⚠️ **Non può stare col corpo.** Con `evenodd` la corona si cancellerebbe nel pezzo in cui entra
 * nella cassa, e le due lancette si bucherebbero a vicenda proprio dove si incrociano, cioè al
 * perno: resterebbe un quadrante con un quadratino vuoto in mezzo. Due tracciati, due regole — è la
 * stessa coppia dell'ampolla e del virione.
 */
const DURATION_CROWN_AND_HANDS =
  'M11.1 3.9h1.8a1.2 1.2 0 0 1 1.2 1.2v3.1h-4.2V5.1a1.2 1.2 0 0 1 1.2-1.2Z' +
  'M12.9 15.4h-1.8v-4.3a.9.9 0 0 1 1.8 0Z' +
  'M11.1 13.6h3.6a.9.9 0 0 1 0 1.8h-3.6Z';

/**
 * **Durata.** Quanto dura una partita: il segno che sta davanti a «45–60 min» sulla scheda di un
 * gioco, e davanti al filtro che cerca una partita corta.
 *
 * È un **cronometro** e non un orologio da parete, ed è una differenza di significato prima che di
 * disegno: un orologio dice che ora è, un cronometro dice quanto tempo passa. La corona sopra è
 * tutto quello che serve a dirlo.
 *
 * ⚠️ **L'anello è largo 2,4 unità su 24**, cioè 1,6 pixel a 16px: è la misura che tiene il
 * quadrante aperto abbastanza da far leggere le lancette. Ingrossarlo chiude il quadrante,
 * assottigliarlo fa sparire la cassa.
 *
 * ⚠️ **Le lancette sono ferme sulle tre**, e non è una posizione a caso: due lancette ad angolo
 * retto sono la posa in cui si leggono come due, mentre sovrapposte o quasi diventano un trattino
 * solo. Un cronometro vero è a zero, ma a zero non ha niente da mostrare.
 */
export function DurationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={DURATION_CASE} fillRule="evenodd" />
      <path d={DURATION_CROWN_AND_HANDS} />
    </IconBase>
  );
}
