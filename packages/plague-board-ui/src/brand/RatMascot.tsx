import {
  RAT_MASCOT_HEIGHT,
  RAT_MASCOT_SRC,
  RAT_MASCOT_WIDTH,
} from '../assets/ratMascotImage.js';

const RAPPORTO = RAT_MASCOT_WIDTH / RAT_MASCOT_HEIGHT;

export interface RatMascotProps {
  /**
   * L'altezza a cui mostrarlo, in pixel.
   *
   * ⚠️ **È l'altezza, non il lato**: il disegno non è quadrato come le icone, e nell'intestazione
   * a decidere è quanto è alta la riga. La larghezza la calcola lui dal disegno, e finisce
   * sull'attributo `width` insieme a `height` così il browser sa che spazio riservare.
   */
  size?: number;
  /** Classi aggiuntive sull'immagine. */
  className?: string;
  /**
   * Il nome con cui si annuncia. Senza, è **decorativo** — come le icone, e per la stessa ragione:
   * dentro un {@link TalkingMascot} il nome ce l'ha il comando, e ripeterlo lo fa dire due volte.
   */
  title?: string;
}

/**
 * **Il topo bianco con l'ampolla di veleno**, la mascotte dei Ludoratti.
 *
 * È una delle facce che si possono dare a {@link TalkingMascot}; le altre sono {@link RatIcon}, il
 * segno di linea che prende il colore del testo, e qualunque cosa passi chi lo usa. La mascotte non
 * conosce nessuna faccia: si sceglie passandola come figlio.
 *
 * ```tsx
 * <TalkingMascot label="Il ratto" phrases={RAT_PHRASES}>
 *   <RatMascot size={64} />
 * </TalkingMascot>
 * ```
 *
 * ⚠️ **È un raster, quindi non segue il tema e non si colora.** Il contorno scuro e spesso lo tiene
 * su nei due temi — è disegnato per stare su qualunque fondo — ma dove serve un segno che prende il
 * colore del testo, o che scala a qualunque misura, la faccia giusta è {@link RatIcon}.
 *
 * ⚠️ **Il disegno viaggia dentro il modulo**, non come file accanto: il perché sta in
 * `assets/ratMascotImage.ts`, insieme a come è stato convertito.
 */
export function RatMascot({ size = 64, className = '', title }: RatMascotProps) {
  return (
    <img
      src={RAT_MASCOT_SRC}
      // Senza `title` l'`alt` resta vuoto, che è il modo con cui un'immagine si dichiara
      // decorativa: sparisce dall'albero di accessibilità invece di annunciarsi col nome del file.
      alt={title ?? ''}
      width={Math.round(size * RAPPORTO)}
      height={size}
      className={className}
      // ⚠️ Un'immagine dentro un comando premibile si può afferrare col mouse, e il trascinamento
      // mangia la pressione: si preme, ci si sposta di due pixel, e non succede niente. Un SVG il
      // problema non ce l'ha, un `<img>` sì.
      draggable={false}
    />
  );
}
