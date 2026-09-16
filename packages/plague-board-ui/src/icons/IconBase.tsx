import type { ReactNode } from 'react';

import type { IconProps } from './types';

interface IconBaseProps extends IconProps {
  /** Il riquadro del disegno. Le icone dei Ludoratti stanno tutte su una griglia 24×24. */
  viewBox?: string;
  /**
   * I tracciati. **Non portano `fill`**: lo ereditano dall'`<svg>`, che è l'unico a conoscere
   * `color`. Così il colore si cambia in un posto solo anche in un disegno a più tracciati.
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
  children,
}: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill={color}
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
