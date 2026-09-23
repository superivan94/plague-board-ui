import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/**
 * Una falce: l'arco del disco grande, raggio 9,5 attorno al centro, e il morso di un disco più
 * piccolo che entra da in alto a destra.
 *
 * Il morso è un arco di raggio 7 fra la cima del disco (12 · 2,5) e il suo fianco destro
 * (21,5 · 12): a flag `0 0` curva verso il centro, e il disco grande chiude la sagoma girando dal
 * lato opposto. Un tracciato solo e a campitura, senza fori: la falce è la forma, non un disco
 * bucato.
 */
const CRESCENT = 'M12 2.5a7 7 0 0 0 9.5 9.5a9.5 9.5 0 1 1-9.5-9.5Z';

/**
 * **La luna: il tema scuro.** Una falce, nel commutatore del tema.
 *
 * Sta nel riquadro da 2,5 a 21,5, coi margini delle altre icone di casa.
 */
export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={CRESCENT} />
    </IconBase>
  );
}
