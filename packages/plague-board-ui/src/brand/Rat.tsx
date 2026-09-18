import {
  RAT_BODY,
  RAT_COLLAR,
  RAT_HARNESS,
  RAT_KIT_COLORS,
  RAT_SKULL,
  RAT_VIEW_BOX,
  type RatBodySlot,
  type RatKitColor,
  type RatPath,
} from './ratArt';

/**
 * Le tre livree: i colori del pelo **misurati sulle tre reference**, uno per ogni slot del disegno
 * ricalcato. Il pelo, la sua ombra, la pancia, l'ombra della pancia; il rosa e la sua ombra per
 * orecchie, coda e zampe; l'occhio, l'inchiostro e la luce nell'occhio. L'albino ha la pancia dello
 * stesso bianco del pelo e l'ombra blu-grigia, com'è nella reference.
 *
 * ⚠️ Statiche, e si dichiara: sono il pelo di un animale, non colori del tema. Un ratto grigio è
 * grigio su fondo chiaro come su fondo scuro, e lo tiene su il contorno d'inchiostro.
 */
export const RAT_LIVERIES: Record<'grey' | 'white' | 'brown', Record<RatBodySlot, string>> = {
  grey: { fur: '#585860', shade: '#484850', belly: '#e0e0e0', bellyShade: '#b8b8b8', pink: '#f8b0a8', pinkShade: '#f09898', eye: '#d01820', ink: '#100020', highlight: '#ffffff' },
  white: { fur: '#fdfdfd', shade: '#c8d8e8', belly: '#f4f6f8', bellyShade: '#c8d8e8', pink: '#f8b0a8', pinkShade: '#f09898', eye: '#d01820', ink: '#100020', highlight: '#ffffff' },
  brown: { fur: '#a86040', shade: '#884838', belly: '#f8e0c0', bellyShade: '#e0c0a0', pink: '#f8b0a8', pinkShade: '#f09898', eye: '#d01820', ink: '#100020', highlight: '#ffffff' },
};

export type RatLivery = keyof typeof RAT_LIVERIES;

const RATIO = RAT_VIEW_BOX.width / RAT_VIEW_BOX.height;

export interface RatProps {
  /** Quale pelo. Il grigio è il ratto normale; il bianco albino e il marrone sono le varianti. */
  livery?: RatLivery;
  /**
   * L'altezza a cui disegnarlo, in pixel.
   *
   * ⚠️ **È l'altezza, come per {@link RatMascot}**: un ratto in corsa è lungo il doppio di quanto è
   * alto, quindi «il lato» non vorrebbe dire niente. La lunghezza la porta il rapporto del disegno.
   */
  size?: number;
  /** Il teschio di corvo portato come elmo, col becco sul muso e la cinghia sotto il mento. */
  hasSkull?: boolean;
  /** Il collare viola strappato, con la pedina di legno che ci pende. */
  hasCollar?: boolean;
  /** L'imbracatura di cuoio con l'ampolla di veleno sul dorso e il dado che ci pende. */
  hasVial?: boolean;
  /** Classi aggiuntive sull'`<svg>`. È da qui che passano l'alone della peste e il ribaltamento. */
  className?: string;
  /** Il nome con cui si annuncia. Senza, è **decorativo**. */
  title?: string;
}

/** Un livello del disegno: i percorsi con il colore risolto. */
function Layer<C extends string>({
  paths,
  colors,
  className,
}: {
  paths: readonly RatPath<C>[];
  colors: Record<C, string>;
  className: string;
}) {
  return (
    <g className={className}>
      {paths.map((p, i) => (
        <path key={i} fill={colors[p.c]} d={p.d} />
      ))}
    </g>
  );
}

/**
 * **Il ratto dei Ludoratti**, in corsa, di profilo verso destra.
 *
 * Non è disegnato a mano: è **ricalcato** dalle tre illustrazioni in `art/reference/`, generate
 * nello stile della mascotte con l'ampolla — contorno d'inchiostro `#100020`, campiture piatte
 * con un tono d'ombra per materiale, occhio rosso con la luce. Il corpo viene dal ratto grigio e
 * si ricolora per livrea; i tre kit vengono dagli altri due e si accendono **indipendentemente**,
 * così uno sciame li può combinare a caso: un bruno con l'ampolla, un albino col teschio, un grigio
 * con tutto. Il come sta in `scripts/genera-ratto.mjs`, e `ratArt.ts` è il suo prodotto.
 *
 * ⚠️ **La cornice è una sola, con o senza kit**: accendere l'ampolla non sposta il ratto e non gli
 * cambia la misura. Per questo un ratto nudo ha aria sopra la testa, dove starebbe l'ampolla.
 *
 * ⚠️ **Sta fermo, ed è il punto.** Qui dentro non c'è nessun `<style>`; le regole che lo faranno
 * correre vivono in `animations.css`, agganciate ai gruppi `pb-rat-body`, `pb-rat-skull`,
 * `pb-rat-collar`, `pb-rat-vial`. ⚠️ Le zampe e la coda **non sono ancora gruppi a sé**: il ricalco
 * dà livelli per colore, non per parte, e separarli — con la maschera per parte e il completamento
 * delle articolazioni — è il lavoro di `RatRun`.
 *
 * ⚠️ **Guarda a destra.** Per farlo andare dall'altra parte si ribalta chi lo contiene con
 * `scale-x-[-1]`.
 */
export function Rat({
  livery = 'grey',
  size = 60,
  hasSkull = false,
  hasCollar = false,
  hasVial = false,
  className = '',
  title,
}: RatProps) {
  const colors = RAT_LIVERIES[livery];
  const kit: Record<RatKitColor, string> = RAT_KIT_COLORS;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${RAT_VIEW_BOX.x} ${RAT_VIEW_BOX.y} ${RAT_VIEW_BOX.width} ${RAT_VIEW_BOX.height}`}
      width={Math.round(size * RATIO)}
      height={size}
      className={className}
      role={title === undefined ? undefined : 'img'}
      aria-hidden={title === undefined ? true : undefined}
      aria-label={title}
    >
      {title !== undefined && <title>{title}</title>}
      <Layer className="pb-rat-body" paths={RAT_BODY} colors={colors} />
      {/* Il collare sta sotto l'imbracatura, e il teschio sopra a tutto: copre il bordo dell'orecchio. */}
      {hasCollar && <Layer className="pb-rat-collar" paths={RAT_COLLAR} colors={kit} />}
      {hasVial && <Layer className="pb-rat-vial" paths={RAT_HARNESS} colors={kit} />}
      {hasSkull && <Layer className="pb-rat-skull" paths={RAT_SKULL} colors={kit} />}
    </svg>
  );
}
