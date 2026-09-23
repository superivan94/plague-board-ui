import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/** Il disco al centro, raggio 4,5. */
const DISC = 'M12 7.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 1 1 0-9Z';

/**
 * I quattro raggi dritti, capsule larghe 2 da 7,5 a 10,5 dal centro.
 *
 * ⚠️ **Gli altri quattro sono gli stessi ruotati di 45°**, con una `transform` sul gruppo invece di
 * quattro tracciati calcolati a mano: le coordinate di una capsula in diagonale vengono con tre
 * decimali irrazionali, e il primo ritocco a un raggio dritto non arriverebbe a quelli storti.
 * L'attributo sul `<g>` regge perché qui non anima niente: una `transform` in CSS lo sostituirebbe.
 */
const RAYS =
  'M11 2.5a1 1 0 0 1 2 0v1a1 1 0 0 1-2 0Z' +
  'M11 20.5a1 1 0 0 1 2 0v1a1 1 0 0 1-2 0Z' +
  'M2.5 11h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2Z' +
  'M20.5 11h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2Z';

/**
 * **Il sole: il tema chiaro.** Un disco pieno e otto raggi staccati, nel commutatore del tema.
 *
 * ⚠️ **I raggi sono staccati dal disco**, ed è quello che lo tiene un sole anche a 16px: attaccati
 * diventerebbero una ruota dentata, cioè le impostazioni. È l'errore del batterio di `ludoratti.it`
 * al rovescio — lì un cerchio coi raggi voleva essere un germe e si leggeva come un sole.
 */
export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={DISC} />
      <path d={RAYS} />
      <g transform="rotate(45 12 12)">
        <path d={RAYS} />
      </g>
    </IconBase>
  );
}
