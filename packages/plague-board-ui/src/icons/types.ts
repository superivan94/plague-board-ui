/**
 * Il contratto di un'icona della libreria.
 *
 * È anche il contratto che deve rispettare chi ne **sostituisce** una: ogni componente del
 * pacchetto mostra la propria icona predefinita, ma chi installa dev'essere libero di passargli la
 * sua. Per questo il tipo è pubblico — senza, la sostituzione si potrebbe fare solo a occhio.
 */
export interface IconProps {
  /** Il lato del quadrato, in pixel. Le icone sono quadrate: una misura sola basta. */
  size?: number;
  /** Classi aggiuntive sull'elemento `<svg>`. */
  className?: string;
  /**
   * Il colore del disegno. Accetta anche l'esadecimale a otto cifre con la trasparenza dentro —
   * `#00ff0040` — che è la forma con cui il fondale della peste le usa davvero.
   */
  color?: string;
  /**
   * Il nome con cui l'icona si annuncia. Senza, è **decorativa**: gli screen reader la saltano, ed
   * è il caso normale, perché un'icona accanto a un testo che dice già la stessa cosa raddoppia
   * l'annuncio. Si passa quando l'icona è l'unico contenuto di un comando.
   */
  title?: string;
}
