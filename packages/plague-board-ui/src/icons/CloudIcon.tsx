import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/**
 * Tre lobi e una base piatta, uniti in un tracciato solo.
 *
 * I quattro pezzi si **sommano** invece di forarsi a vicenda, al contrario dei punti del dado:
 * girano tutti nello stesso verso, e con il riempimento a soletta piena (`nonzero`, il
 * predefinito) una sovrapposizione resta piena. È il modo più corto di scrivere una silhouette
 * fatta di cerchi: la sagoma è il bordo esterno dell'unione, e i tagli interni non si vedono.
 *
 * ⚠️ **La base è un rettangolo, e non è pigrizia: è ciò che distingue una cappa da una nuvola.**
 * Un cumulo ha il fondo smerlato come la cima; quella che sta sopra una città ha una linea piatta
 * sotto, perché è ferma e poggia sull'aria calda. Il rettangolo va da un centro all'altro dei due
 * lobi bassi — da 7 a 18 — quindi i suoi spigoli restano dentro i cerchi e a chiudere la sagoma
 * ai due capi sono loro.
 */
const CLOUD_PATH =
  'M1.5 13.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 1 1-11 0Z' +
  'M6 11a7 7 0 1 1 14 0a7 7 0 1 1-14 0Z' +
  'M13.5 14.5a4.5 4.5 0 1 1 9 0a4.5 4.5 0 1 1-9 0Z' +
  'M7 12h11v7H7Z';

/**
 * **La cappa.** La massa di smog che sta sopra la città: il registro «futuro distopico»
 * dell'aggregatore, dove ne galleggiano due larghe 192 e 256 pixel dietro tutto il resto.
 *
 * Si usa **grande e tenue**, come fondale — non accanto a un testo. Alla misura di un'icona è una
 * nuvoletta, e non dice niente; a 200px e al 20% di opacità è il cielo.
 *
 * ⚠️ **È ridisegnata, e quella di `ludoratti.it` era la nuvola di Material Symbols.** Due motivi,
 * e il primo è la regola di casa: Material non entra nella libreria, tanto che `CodeIcon` e
 * `RobotIcon` sono state ridisegnate per lo stesso motivo. Il secondo si misura: quel tracciato è
 * largo **tutte e 24** le unità del riquadro e tocca i due bordi, quindi alla stessa `size`
 * sembrava più grande di ogni altra icona della famiglia. Questa sta in 1,5–22,5, coi margini che
 * hanno tutte.
 */
export function CloudIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={CLOUD_PATH} />
    </IconBase>
  );
}
