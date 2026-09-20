import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il corpo e i cinque punti, in un tracciato solo.
 *
 * ⚠️ **I punti sono buchi, non dischi dipinti**, ed è quello che fa funzionare il dado su
 * qualunque fondo: un disco del colore della pagina sarebbe giusto in chiaro e sbagliato in scuro,
 * e dentro una pastiglia colorata sarebbe sbagliato due volte. Con `fill-rule="evenodd"` il secondo
 * tracciato che si sovrappone al primo lo **fora**, quindi da quei cinque cerchi si vede quello che
 * c'è dietro, qualunque cosa sia.
 *
 * La faccia è il **cinque**: è simmetrica sui due assi, quindi non sembra storta accanto a icone
 * che storte non sono, e il punto in mezzo è ciò che la distingue da una griglia di quadretti.
 */
const DICE_PATH =
  'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z' +
  'M6.3 7.8a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0Z' +
  'M14.7 7.8a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0Z' +
  'M10.5 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0Z' +
  'M6.3 16.2a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0Z' +
  'M14.7 16.2a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0Z';

/**
 * **Il dado.** Il segno dei **giochi da tavolo**, e l'unica icona della libreria che non porta
 * un'idea di malattia.
 *
 * Sta accanto al teschio e al biohazard e dà il terzo termine del racconto: peste, ratti,
 * **gioco**. Senza di lui la famiglia dice solo che cosa siamo, non che cosa facciamo — e nessuna
 * delle due applicazioni ce l'aveva, perché di là il gioco lo dicono le emoji.
 *
 * ⚠️ **Non scende sotto i 16px.** A quella misura i punti sono larghi due pixel e la cornice uno:
 * il dado regge, ma è il suo limite. Sotto, i cinque buchi si chiudono e resta un quadrato
 * stondato — che è un quadrato stondato, non un dado.
 */
export function DiceIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={DICE_PATH} fillRule="evenodd" />
    </IconBase>
  );
}
