import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * La sagoma: una punta in cima e un bulbo tondo in fondo. È una goccia che **cade**, non che pende.
 *
 * ⚠️ **Il bulbo è un cerchio vero, e quella di `ludoratti.it` non lo era.** La sua è appuntita a
 * tutti e due i capi — la larghezza massima sta a 8,82 su 20, cioè sopra la metà — quindi a occhio
 * è una mandorla, e stirata in verticale diventa una lama. Qui la metà bassa è un cerchio di
 * raggio 4 centrato a `(4, 16)`, e la punta ci arriva tangente: pesa in fondo, come un liquido.
 */
const DRIP_PATH =
  'M4 0C5.2 7 8 11.5 8 16C8 18.21 6.21 20 4 20C1.79 20 0 18.21 0 16C0 11.5 2.8 7 4 0Z';

/** Il riflesso sul bulbo, che è ciò che la fa sembrare bagnata invece che disegnata. */
const DRIP_SHINE = 'M2.4 13C1.9 14.3 1.9 15.7 2.5 16.8';

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
