import { IconBase } from './IconBase.js';
import { SKULL_PATH } from './SkullIcon.js';
import type { IconProps } from './types.js';

/**
 * Come il teschio si rimpicciolisce per far posto alle cuffie.
 *
 * ⚠️ **Il cranio non si ridisegna, si sposta e si scala.** `SkullIcon` riempie la griglia da 24
 * (x 3–21, y 2–22) e le cuffie devono passargli **attorno**: allargare il `viewBox` lo
 * rimpicciolirebbe lo stesso, ma romperebbe la regola per cui le icone dei Ludoratti stanno tutte
 * su una griglia sola. Col fattore qui sotto il teschio finisce in x 5,5–18,5 e y 7,6–22, e sopra
 * restano otto unità per l'archetto.
 */
const SKULL_FIT = 'translate(3.36 6.16) scale(0.72)';

/**
 * L'archetto, che passa **fuori** dalla calotta: raggio 8 dal centro (12, 12), cioè un'unità e
 * mezza oltre il punto più largo del cranio rimpicciolito.
 */
export const HEADBAND_PATH = 'M4 14V12A8 8 0 0 1 20 12V14';

/** I due padiglioni, uno per tempia. L'archetto ci entra dentro, che è come stanno le cuffie. */
export const EARCUP_PATHS = [
  'M3.4 12.6H4.2A1.8 1.8 0 0 1 6 14.4V16.8A1.8 1.8 0 0 1 4.2 18.6H3.4A1.8 1.8 0 0 1 1.6 16.8V14.4A1.8 1.8 0 0 1 3.4 12.6Z',
  'M19.8 12.6H20.6A1.8 1.8 0 0 1 22.4 14.4V16.8A1.8 1.8 0 0 1 20.6 18.6H19.8A1.8 1.8 0 0 1 18 16.8V14.4A1.8 1.8 0 0 1 19.8 12.6Z',
];

/** Il teschio al suo posto sotto le cuffie: lo montano tutte e due le icone della musica. */
export function SkullUnderPhones() {
  return (
    <>
      <g transform={SKULL_FIT}>
        <path d={SKULL_PATH} />
      </g>
      <path d={HEADBAND_PATH} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {EARCUP_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  );
}

/**
 * **La musica di casa.** Il teschio dei Ludoratti con le cuffie: è il segno con cui RattInventario
 * marca il comando dell'audio nella schermata di accesso, e vale «qui suona qualcosa» meglio di una
 * nota, perché la nota la usano tutti e il teschio è nostro.
 *
 * ⚠️ **Il cranio è {@link SkullIcon}, non un teschio nuovo** — chiesto dall'utente il 2026-09-20,
 * ed è la differenza che si vede: due teschi disegnati a mano nello stesso pacchetto divergono al
 * primo ritocco, e chi li guarda affiancati nota subito che non sono lo stesso. Qui il tracciato è
 * importato e rimpicciolito; di là, invece, il comando dell'audio ne porta **un terzo**, diverso da
 * quello delle sue stesse intestazioni.
 *
 * ⚠️ **E di là sono due `<svg>` sovrapposti**, con occhi e naso `fill="black"`: tre macchie scure
 * su qualunque superficie che nera non sia, e due disegni che a misure diverse si scollano. Il
 * nostro cranio i buchi ce li ha per avvolgimento, quindi si vede quello che c'è sotto.
 *
 * Per lo stato spento c'è {@link SkullPhonesOffIcon}, che è questo con una sbarra.
 */
export function SkullPhonesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <SkullUnderPhones />
    </IconBase>
  );
}
