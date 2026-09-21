import type { ReactNode } from 'react';

import type { IconProps } from './types';

/**
 * Il contratto dell'involucro: {@link IconProps} più le quattro cose che dipendono dal **disegno**
 * e non da chi lo monta.
 */
export interface IconBaseProps extends IconProps {
  /** Il riquadro del disegno. Le icone dei Ludoratti stanno tutte su una griglia 24×24. */
  viewBox?: string;
  /**
   * L'altezza, quando **non** è uguale alla larghezza.
   *
   * ⚠️ Non sta in `IconProps` apposta: il contratto pubblico di un'icona è quadrato — `size` è il
   * lato — e questo è lo sfogo per l'unico disegno che quadrato non è, la goccia, che è alta due
   * volte e mezzo tanto e per di più si **allunga** cadendo. Chi sostituisce un'icona di un
   * componente continua a doversela vedere solo con `IconProps`.
   */
  height?: number;
  /**
   * Come il disegno riempie il riquadro quando le due misure non sono in proporzione col
   * `viewBox`. `none` lo stira, ed è quello che vuole una goccia che si allunga.
   */
  preserveAspectRatio?: string;
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
 * Esiste perché ogni icona è lo stesso `<svg>` con un `d` diverso, e in RattInventario quello
 * stesso involucro è ricopiato una volta per icona — quindi la regola su come un'icona si presenta
 * ai lettori di schermo lì andrebbe cambiata in quattro punti, e qui in uno.
 *
 * ⚠️ **È pubblico, ed è il pezzo con cui si disegna un'icona che questa libreria non avrà mai.**
 * I segni di un dominio applicativo qui non entrano — giocatori, durata, difficoltà sono di chi fa
 * il catalogo, non del marchio — quindi chi ne ha bisogno li disegna a casa sua, e senza questo
 * componente si ritroverebbe a ricopiare il nostro `<svg>`: la copia che la libreria esiste per
 * togliere. Il tracciato è la sola cosa che cambia:
 *
 * ```tsx
 * export function PlayersIcon(props: IconProps) {
 *   return (
 *     <IconBase {...props}>
 *       <path d="M8 11a3 3 0 1 0…" />
 *     </IconBase>
 *   );
 * }
 * ```
 *
 * Quello che ci si prende gratis è tutto ciò che a occhio non si vede: la griglia **24×24**, il
 * colore che arriva ai tracciati per `currentColor` — così un disegno a tratto fuori e pieno dentro
 * si tinge tutto insieme — e la regola di accessibilità, cioè che un'icona senza `title` è
 * decorativa e sparisce dall'albero invece di raddoppiare il testo che le sta accanto.
 *
 * ⚠️ **I tracciati non portano né `fill` né `stroke`**: li ereditano. Scriverli addosso a un
 * `<path>` spegne `color` per quel pezzo, ed è il modo in cui un'icona esce mezza tinta.
 */
export function IconBase({
  size = 24,
  className = '',
  color = 'currentColor',
  title,
  viewBox = '0 0 24 24',
  height,
  preserveAspectRatio,
  paint = 'fill',
  children,
}: IconBaseProps) {
  const stroked = paint === 'stroke';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height ?? size}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
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
