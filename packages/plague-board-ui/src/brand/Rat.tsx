/**
 * Le tre livree, copiate senza ritocchi da `RunningRat.tsx` di RattInventario — comprese le due
 * scritte a tre cifre, perché il collaudo che confronta questo disegno con quello in produzione lo
 * fa **carattere per carattere**, e normalizzarle qui vorrebbe dire dover normalizzare anche là.
 *
 * ⚠️ **Restano statiche, e si dichiara.** Non sono colori del tema: sono il pelo di un animale, e
 * un ratto grigio è grigio su fondo chiaro come su fondo scuro. La regola dei colori del progetto
 * dice che nel dubbio un colore resta statico — qui il dubbio non c'è nemmeno.
 */
export const RAT_LIVERIES = {
  grey: { body: '#595959', ear: '#808080', tail: '#707070', eye: '#1a1a1a', nose: '#333' },
  white: { body: '#f7f7f7', ear: '#fec5d6', tail: '#fec5d6', eye: '#ff4d4d', nose: '#ffb3b3' },
  brown: { body: '#8B4513', ear: '#A0522D', tail: '#654321', eye: '#000', nose: '#2F1B14' },
} as const;

export type RatLivery = keyof typeof RAT_LIVERIES;

/**
 * La cornice, **misurata sui pixel dipinti**: si disegna l'SVG su una tela a 4× e si cerca il primo
 * e l'ultimo pixel non trasparente. Esce da −33,75 a 122 in orizzontale e da 18,75 a 65 in
 * verticale, arrotondato in fuori per non tagliare l'antialiasing.
 *
 * ⚠️ **`getBBox()` non basta, e nemmeno `getBoundingClientRect()`: il tratto non lo contano.**
 * Misurati tutti e tre il 2026-09-17, i primi due danno la coda a **−31,67** — la geometria del
 * percorso — mentre il pixel più a sinistra sta a **−33,75**, perché `stroke-width: 4` con la
 * punta tonda dipinge 2 oltre. Fidandosi di `getBBox()` la coda resterebbe tagliata di due unità.
 *
 * ⚠️ E la cornice comincia **in negativo** apposta. Di là era `0 0 120 60` con `overflow: visible`:
 * il ratto sbordava dalla propria scatola, quindi la sua misura non diceva quanto spazio occupava
 * e metterlo in una riga era impossibile.
 */
const VIEW_BOX = { x: -34, y: 18, width: 156, height: 47 } as const;
const RAPPORTO = VIEW_BOX.width / VIEW_BOX.height;

export interface RatProps {
  /** Quale pelo. Il grigio è il ratto normale; il bianco e il marrone sono le varianti. */
  livery?: RatLivery;
  /**
   * L'altezza a cui disegnarlo, in pixel.
   *
   * ⚠️ **È l'altezza, come per {@link RatMascot}**: un ratto è lungo più di tre volte quanto è
   * alto, quindi «il lato» non vorrebbe dire niente. La lunghezza la porta il rapporto del disegno.
   */
  size?: number;
  /** Classi aggiuntive sull'`<svg>`. È da qui che passano l'alone della peste e il ribaltamento. */
  className?: string;
  /** Il nome con cui si annuncia. Senza, è **decorativo**. */
  title?: string;
}

/**
 * **Il ratto disegnato**, di profilo: coda, corpo, muso, orecchie, baffi e quattro zampe.
 *
 * ⚠️ **Sta fermo, ed è il punto.** Di là questo disegno viveva dentro `RunningRat`, insieme a
 * **novanta righe** di `<style>` incorporato con sei `@keyframes`: ogni ratto sullo schermo se ne
 * portava una copia, le animazioni non si potevano spegnere, e un ratto fermo non esisteva.
 * Qui il disegno è una cosa e il movimento un'altra — le parti che si muovono portano un nome
 * (`pb-rat-tail`, `pb-rat-ears`, `pb-rat-leg-front`, `pb-rat-leg-back`, `pb-rat-body`) e le regole
 * che le animano vivono in `animations.css`, agganciate a una classe che mette chi lo fa correre.
 *
 * ⚠️ **Guarda a destra.** Per farlo andare dall'altra parte si ribalta chi lo contiene con
 * `scale-x-[-1]`, che è quello che faceva anche l'originale.
 *
 * ⚠️ **L'alone verde della peste non è qui.** Di là era un `filter: drop-shadow(0 0 3px #00ff00)
 * hue-rotate(90deg)` più due occhi che pulsano: il filtro lo può mettere chi lo usa con
 * `className`, e gli occhi che pulsano sono un'animazione, quindi appartengono a chi anima.
 */
export function Rat({ livery = 'grey', size = 60, className = '', title }: RatProps) {
  const colors = RAT_LIVERIES[livery];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      width={Math.round(size * RAPPORTO)}
      height={size}
      className={className}
      role={title === undefined ? undefined : 'img'}
      aria-hidden={title === undefined ? true : undefined}
      aria-label={title}
    >
      {title !== undefined && <title>{title}</title>}

      {/* La coda: un tratto solo, che parte dall'anca e si arriccia all'indietro. È la parte che
          esce più a sinistra di tutte, ed è il motivo per cui la cornice comincia in negativo. */}
      <path
        className="pb-rat-tail"
        d="M25,48 Q10,35 -5,40 Q-20,45 -30,35 Q-35,30 -25,25"
        stroke={colors.tail}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <g className="pb-rat-body">
        <ellipse cx="65" cy="45" rx="35" ry="18" fill={colors.body} />
        {/* Testa e muso: due ellissi che si sovrappongono, la seconda più avanti e più bassa. */}
        <ellipse cx="95" cy="38" rx="18" ry="12" fill={colors.body} />
        <ellipse cx="108" cy="40" rx="8" ry="6" fill={colors.body} />
        <ellipse cx="113" cy="39" rx="2" ry="1.5" fill={colors.nose} />

        <g className="pb-rat-ears">
          <ellipse cx="85" cy="28" rx="6" ry="8" fill={colors.ear} />
          <ellipse cx="95" cy="26" rx="5" ry="7" fill={colors.ear} />
        </g>

        {/* Due occhi, non uno: il secondo è quello dall'altro lato del muso, più piccolo perché
            più lontano. È ciò che dà la posa di tre quarti a un disegno di profilo. */}
        <circle cx="98" cy="35" r="2.5" fill={colors.eye} />
        <circle cx="103" cy="37" r="1.5" fill={colors.eye} />

        <g stroke={colors.eye} strokeWidth="0.5" opacity="0.7">
          <path d="M108,37 L120,35" />
          <path d="M108,40 L122,40" />
          <path d="M108,43 L120,45" />
        </g>

        {/* Le quattro zampe. ⚠️ Ognuna sta dentro un `<g>` che la sposta, perché l'animazione che
            le farà girare ha `transform-origin` in alto: ruotare l'ellisse spostata la porterebbe
            a descrivere un arco invece di oscillare sull'anca. */}
        <g transform="translate(75, 55)">
          <ellipse className="pb-rat-leg-front" cx="0" cy="0" rx="3" ry="8" fill={colors.body} />
        </g>
        <g transform="translate(85, 55)">
          <ellipse className="pb-rat-leg-front" cx="0" cy="0" rx="3" ry="8" fill={colors.body} />
        </g>
        <g transform="translate(45, 55)">
          <ellipse className="pb-rat-leg-back" cx="0" cy="0" rx="4" ry="10" fill={colors.body} />
        </g>
        <g transform="translate(55, 55)">
          <ellipse className="pb-rat-leg-back" cx="0" cy="0" rx="4" ry="10" fill={colors.body} />
        </g>
      </g>
    </svg>
  );
}
