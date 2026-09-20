import { IconBase } from './IconBase';
import type { IconProps } from './types';

/** La sagoma: appuntita in cima, tonda in fondo. È una goccia che **cade**, non che pende. */
const DRIP_PATH = 'M4 20C4 20 8 13.68 8 8.82C8 3.96 4 0 4 0C4 0 0 3.96 0 8.82C0 13.68 4 20 4 20Z';

/** Il riflesso sul fianco, che è ciò che la fa sembrare bagnata invece che disegnata. */
const DRIP_SHINE = 'M4.5 3C5.5 6 6 8.5 5 11';

export interface DripIconProps extends IconProps {
  /**
   * L'altezza in pixel. Predefinita a due volte e mezzo `size`, che è la proporzione del disegno.
   *
   * ⚠️ **È l'unica icona della libreria che non è quadrata**, e l'unica che accetta di essere
   * stirata: una goccia che cade si allunga, e `animations.css` gliela allunga davvero con uno
   * `scaleY(1.6)` dentro `pb-drip`. Per questo il disegno è a `preserveAspectRatio="none"`.
   */
  height?: number;
}

/**
 * **La goccia che cola.** Viene da `ludoratti.it`, dove ne scendono tre di misure diverse da sotto
 * l'intestazione: è il segno che dice «qui qualcosa gocciola» senza dover disegnare da dove.
 *
 * ⚠️ **Il riflesso è bianco e resta bianco**, anche quando la goccia è verde: è una luce che si
 * specchia sulla superficie, non una parte del liquido, e dipingerlo del colore della goccia la
 * appiattirebbe. Sta al 30% di opacità, quindi su una goccia chiara non si vede e su una scura sì.
 */
export function DripIcon({ size = 8, height, ...props }: DripIconProps) {
  return (
    <IconBase
      {...props}
      size={size}
      height={height ?? size * 2.5}
      viewBox="0 0 8 20"
      preserveAspectRatio="none"
    >
      <path d={DRIP_PATH} />
      <path
        d={DRIP_SHINE}
        fill="none"
        stroke="white"
        strokeWidth="1.2"
        strokeOpacity="0.3"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
