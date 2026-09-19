import type { CSSProperties } from 'react';

import type { ReactNode } from 'react';

import {
  RAT_BODY_PIVOT,
  RAT_COLLAR,
  RAT_HARNESS,
  RAT_KIT_COLORS,
  RAT_PARTS,
  RAT_SKULL,
  RAT_TORSO,
  RAT_VIEW_BOX,
  type RatBodySlot,
  type RatKitColor,
  type RatKitPiece,
  type RatPart,
  type RatPath,
  type RatPivot,
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
  /**
   * Se le zampe ciclano, la coda ondeggia, il corpo sobbalza e ciò che pende oscilla. Le regole
   * stanno in `animations.css`; qui c'è solo la classe che le accende. Chi attraversa lo schermo lo
   * mette {@link RatRun}; da fermo nella demo il ratto sta fermo.
   */
  isRunning?: boolean;
  /** Classi aggiuntive sull'`<svg>`. È da qui che passano l'alone della peste e il ribaltamento. */
  className?: string;
  /** Il nome con cui si annuncia. Senza, è **decorativo**. */
  title?: string;
}

/** Da `legBackFar` a `leg-back-far`: le classi seguono l'idioma del CSS, i dati quello di TypeScript. */
const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * ⚠️ Il perno è `transform-origin` in **unità della cornice**, e l'`svg` in CSS lo permette perché
 * `transform-box` degli elementi SVG è `view-box`: `137px 110px` vuol dire il punto (137, 110) del
 * `viewBox`, non dello schermo. Senza, ogni rotazione partirebbe dall'angolo in alto a sinistra.
 */
const origin = (pivot: RatPivot): CSSProperties => ({ transformOrigin: `${pivot.x}px ${pivot.y}px` });

function Layer<C extends string>({
  paths,
  colors,
  className,
  pivot,
  children,
}: {
  paths: readonly RatPath<C>[];
  colors: Record<C, string>;
  className: string;
  pivot?: RatPivot;
  children?: ReactNode;
}) {
  return (
    <g className={className} style={pivot === undefined ? undefined : origin(pivot)}>
      {paths.map((p, i) => (
        <path key={i} fill={colors[p.c]} d={p.d} />
      ))}
      {children}
    </g>
  );
}

/**
 * Una parte con dentro i suoi figli: i tre segmenti della coda sono annidati, così il perno del
 * segmento figlio si sposta col padre e la rotazione di uno si somma a quella dell'altro. ⚠️ Il
 * figlio sta **dopo** i percorsi del padre, quindi sopra: il suo giunto tondo copre il taglio.
 */
function Part({ part, colors }: { part: RatPart; colors: Record<RatBodySlot, string> }) {
  return (
    <Layer className={`pb-rat-part pb-rat-${kebab(part.name)}`} paths={part.paths} colors={colors} pivot={part.pivot}>
      {RAT_PARTS.filter((p) => p.parent === part.name).map((p) => (
        <Part key={p.name} part={p} colors={colors} />
      ))}
    </Layer>
  );
}

/** Un kit: i suoi pezzi, ognuno con la classe `pb-rat-<kit>-<pezzo>`; quelli col perno oscillano. */
function Kit({ name, pieces }: { name: string; pieces: readonly RatKitPiece[] }) {
  const kit: Record<RatKitColor, string> = RAT_KIT_COLORS;
  return (
    <g className={`pb-rat-${name}`}>
      {pieces.map((q) => (
        <Layer key={q.name} className={`pb-rat-${name}-${q.name}`} paths={q.paths} colors={kit} pivot={q.pivot} />
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
 * così uno sciame li può combinare a caso. Il come sta in `scripts/genera-ratto.mjs`, e
 * `ratArt.ts` è il suo prodotto.
 *
 * ⚠️ **È un pupazzo articolato, non un disegno solo.** Il tronco è un pezzo; coda e quattro zampe
 * sono pezzi a sé con un perno sull'articolazione, e stanno **dietro** (coda, zampe del lato
 * lontano) o **davanti** (zampe vicine) al tronco. Dove una zampa davanti copre la pancia, il tronco
 * ha pelo sotto — completato dal generatore — così quando la zampa si muove non c'è un buco. Anche
 * la bottiglia, il dado e la pedina hanno un perno: pendono e oscillano.
 *
 * ⚠️ **La cornice è una sola, con o senza kit**: accendere l'ampolla non sposta il ratto e non gli
 * cambia la misura. Per questo un ratto nudo ha aria sopra la testa, dove starebbe l'ampolla.
 *
 * ⚠️ **Sta fermo finché non gli si dice `isRunning`.** Qui dentro non c'è nessun `<style>`: le
 * regole che lo fanno correre vivono in `animations.css`, agganciate a `pb-rat--running` e ai nomi
 * dei pezzi. Il pelo, i perni e l'ordine dei livelli sono qui; il **tempo** è di là.
 *
 * ⚠️ **Guarda a destra.** Per farlo andare dall'altra parte si ribalta con `-scale-x-100`, ed è
 * quello che fa {@link RatRun}.
 */
export function Rat({
  livery = 'grey',
  size = 60,
  hasSkull = false,
  hasCollar = false,
  hasVial = false,
  isRunning = false,
  className = '',
  title,
}: RatProps) {
  const colors = RAT_LIVERIES[livery];
  const roots = RAT_PARTS.filter((p) => p.parent === undefined);
  const behind = roots.filter((p) => p.behind);
  const front = roots.filter((p) => !p.behind);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${RAT_VIEW_BOX.x} ${RAT_VIEW_BOX.y} ${RAT_VIEW_BOX.width} ${RAT_VIEW_BOX.height}`}
      width={Math.round(size * RATIO)}
      height={size}
      className={`pb-rat ${isRunning ? 'pb-rat--running' : ''} ${className}`}
      role={title === undefined ? undefined : 'img'}
      aria-hidden={title === undefined ? true : undefined}
      aria-label={title}
    >
      {title !== undefined && <title>{title}</title>}
      {/* Il gruppo che sobbalza e beccheggia attorno al baricentro: tutto il ratto, kit compresi,
          così l'ampolla sale e scende col dorso. */}
      <g className="pb-rat-body" style={origin(RAT_BODY_PIVOT)}>
        {behind.map((p) => (
          <Part key={p.name} part={p} colors={colors} />
        ))}
        <Layer className="pb-rat-torso" paths={RAT_TORSO} colors={colors} />
        {front.map((p) => (
          <Part key={p.name} part={p} colors={colors} />
        ))}
        {/* Il collare sta sotto l'imbracatura, e il teschio sopra a tutto: copre il bordo dell'orecchio. */}
        {hasCollar && <Kit name="collar" pieces={RAT_COLLAR} />}
        {hasVial && <Kit name="vial" pieces={RAT_HARNESS} />}
        {hasSkull && <Kit name="skull" pieces={RAT_SKULL} />}
      </g>
    </svg>
  );
}
