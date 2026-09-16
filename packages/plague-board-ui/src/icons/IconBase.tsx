import type { ReactNode } from 'react';

import type { IconProps } from './types';

interface IconBaseProps extends IconProps {
  /** Il riquadro del disegno. Le icone dei Ludoratti stanno tutte su una griglia 24×24. */
  viewBox?: string;
  /**
   * Come è fatto il disegno: a **campitura** (`fill`, il caso normale) o a **tratto** (`stroke`).
   *
   * ⚠️ Non è una preferenza estetica, è dove va a finire `color`: un'icona a tratto dipinta col
   * colore sul `fill` diventa una macchia, e una a campitura dipinta sullo `stroke` sparisce.
   * Sceglie l'icona, non chi la usa, perché è una proprietà del suo tracciato.
   */
  paint?: 'fill' | 'stroke';
  /**
   * I tracciati. **Non portano né `fill` né `stroke`**: li ereditano dall'`<svg>`, che è l'unico a
   * conoscere `color`. Così il colore si cambia in un posto solo anche in un disegno a più
   * tracciati.
   */
  children: ReactNode;
}

/**
 * L'involucro comune di ogni icona: misura, colore, classe e il modo in cui si annuncia.
 *
 * Non è pubblico. Esiste perché ogni icona è lo stesso `<svg>` con un `d` diverso, e in
 * RattInventario quell'involucro è ricopiato una volta per icona — quindi la regola su come
 * un'icona si presenta ai lettori di schermo lì andrebbe cambiata in quattro punti, e
 * qui in uno.
 */
export function IconBase({
  size = 24,
  className = '',
  color = 'currentColor',
  title,
  viewBox = '0 0 24 24',
  paint = 'fill',
  children,
}: IconBaseProps) {
  const stroked = paint === 'stroke';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      // ⚠️ Il colore arriva ai tracciati **attraverso `currentColor`**, non scritto dentro `fill`.
      // Costa una riga di `style` in più e serve ai disegni a paint misto — il marchio del ratto è
      // a tratto ma ha le orecchie piene: se il colore stesse nell'attributo `fill` dell'`<svg>`,
      // un figlio che vuole riempirsi non avrebbe modo di leggerlo.
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : undefined}
      style={color === 'currentColor' ? undefined : { color }}
      // Il tratto è a 2 su una griglia da 24 e con gli angoli tondi: è la proporzione con cui sono
      // disegnate le icone a tratto che arrivano da RattInventario, e mischiarne due si vede.
      strokeWidth={stroked ? 2 : undefined}
      strokeLinecap={stroked ? 'round' : undefined}
      strokeLinejoin={stroked ? 'round' : undefined}
      className={className}
      // Senza un titolo l'icona non è un'immagine da annunciare, è un ornamento accanto a un testo
      // che dice già la stessa cosa: si toglie dall'albero di accessibilità invece di raddoppiare.
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
