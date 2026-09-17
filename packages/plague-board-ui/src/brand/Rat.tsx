/**
 * Le tre livree, con i colori del pelo di RattInventario: sono **credibili** — un ratto grigio,
 * uno albino con orecchie e coda rosa e occhi rossi, uno marrone — e restano tali anche adesso che
 * il disegno è rifatto. ⚠️ Statiche, e si dichiara: sono il pelo di un animale, non colori del
 * tema. Un ratto grigio è grigio su fondo chiaro come su fondo scuro.
 */
export const RAT_LIVERIES = {
  grey: { body: '#595959', ear: '#808080', tail: '#707070', eye: '#1a1a1a', nose: '#333333' },
  white: { body: '#f7f7f7', ear: '#fec5d6', tail: '#fec5d6', eye: '#ff4d4d', nose: '#ffb3b3' },
  brown: { body: '#8B4513', ear: '#A0522D', tail: '#654321', eye: '#000000', nose: '#2F1B14' },
} as const;

export type RatLivery = keyof typeof RAT_LIVERIES;

/**
 * **L'inchiostro dei Ludoratti.** È il contorno della mascotte con l'ampolla, misurato sui suoi
 * pixel il 2026-09-17: non è nero, è un viola-nero (`#180828`, il colore scuro più frequente del
 * disegno). Usare lo stesso qui è quello che fa dei due ratti lo stesso personaggio.
 */
const INK = '#180828';
const BONE = '#efe6d3';
const BONE_SHADE = '#d9cdb4';
/** Il veleno è il verde della peste della tavolozza, non quello della mascotte: così l'ampolla sul
 * dorso e l'interfaccia intorno dicono lo stesso verde. */
const POISON = '#22c55e';
const POISON_LIGHT = '#4ade80';
const GLASS = 'rgba(255,255,255,0.22)';
const CORK = '#a16207';

/** Lo spessore del contorno, nelle unità del disegno. A 44px di altezza vale 1,15 pixel. */
const STROKE = 2.4;

// ── La geometria, nelle unità della cornice. Il ratto guarda a destra. ────────────────────────
// Corpo e testa sono **un percorso solo**: è quello che dà collo, spalla e groppa a una sagoma che
// prima era due ellissi sovrapposte. Il muso rastrema fino al naso.
const BODY =
  'M58,50 C56,33 72,25 94,25 C112,25 126,28 136,33 ' +
  'C142,23 156,17 168,22 C180,27 190,38 197,49 ' +
  'C199,52 198,56 193,57 C183,59 173,60 163,60 ' +
  'C151,61 143,64 134,68 C117,75 92,76 74,72 ' +
  'C62,69 58,62 58,50 Z';
// La coda: due bordi che si incontrano in punta — spessa 12 all'anca, zero al termine — e l'arco
// sale all'indietro. Quella di prima era un tratto a spessore costante che si arricciava in avanti.
const TAIL =
  'M61,44 C43,39 25,36 16,29 C8,22 10,12 20,10 ' +
  'C24,12 22,13 21,15 C15,18 15,24 20,29 C29,38 47,47 61,56 Z';
// ⚠️ **Una zampa è un percorso solo**: coscia, stinco e piede in una sagoma, con un contorno.
// Prima erano tre pezzi — una coscia a blob incollata sulla groppa, una capsula, un piede a parte —
// e dove si sovrapponevano i contorni si raddoppiavano. La zampa dietro è la «Z» del roditore,
// semplificata: la coscia sporge all'indietro sulla groppa, il ginocchio punta avanti, lo stinco
// scende all'indietro fino al tallone, il piede va avanti.
const LEG_BACK =
  'M78,46 C62,47 55,60 60,71 C63,78 66,83 67,87 L91,87 C94,87 94,83 91,83 L79,82 ' +
  'C78,77 79,71 84,66 C88,60 90,52 86,47 Z';
// La zampa davanti è dritta, con una leggera spalla, e il piede in avanti.
const LEG_FRONT =
  'M136,59 C127,60 123,68 124,77 C124,82 124,85 125,87 L142,87 C145,87 145,83 142,83 L133,82 ' +
  'C132,76 134,70 139,64 C141,61 140,59 136,59 Z';
// Le dita: un cuscinetto nel colore delle orecchie, **senza contorno**, dentro il piede. È quello
// che sull'albino fa i piedi rosa senza aggiungere un pezzo con il suo bordo.
const PAD_BACK = 'M74,84 L90,84 C91,84 91,86 90,86 L74,86 C73,86 73,84 74,84 Z';
const PAD_FRONT = 'M129,84 L141,84 C142,84 142,86 141,86 L129,86 C128,86 128,84 129,84 Z';
// L'orecchio sta **sul cranio, dietro l'occhio**: sulla fronte leggeva come un fiocco.
const EAR = 'M145,30 C144,18 153,12 162,15 C171,19 172,31 164,36 C156,41 146,39 145,30 Z';
const EAR_FAR = 'M131,31 C130,21 137,16 144,18 C151,21 151,31 145,35 C139,39 132,38 131,31 Z';
const EAR_INNER = 'M149,30 C148,22 154,18 160,20 C166,23 166,31 160,34 C154,37 150,35 149,30 Z';
// Il sopracciglio: un tratto che scende verso il naso. È la differenza fra «un ratto» e «un ratto
// che sa il fatto suo» — senza, l'occhio tondo è tenero.
const BROW = 'M166,35 C171,35.5 176,37 181,39.5';
// Il teschio di corvo, portato come elmo col becco sul muso. Sta un po' avanti sul cranio, così
// dietro spunta il bordo dell'orecchio — senza, il ratto perde la sua sagoma più riconoscibile.
const SKULL = 'M157,34 C155,19 167,8 182,9 C196,10 203,20 202,29 C202,33 200,35 197,36 L162,38 C158,38 157,36 157,34 Z';
const BEAK = 'M198,21 C210,20 220,29 228,42 C229,45 227,46 224,45 C215,39 206,36 197,36 C195,36 195,22 198,21 Z';
const SKULL_SOCKET = 'M176,24 C176,20 180,18 184,19 C188,20 189,25 186,28 C183,30 177,29 176,24 Z';
const SKULL_NOSTRIL = 'M208,30 C211,31 213,33 214,35';
// L'ampolla sulle spalle, con due cinghie. Il liquido è la metà bassa del pallone.
const VIAL = { cx: 112, cy: 17, r: 9 } as const;
const VIAL_LIQUID = 'M103.5,15 A9,9 0 1 0 120.5,15 Z';
const VIAL_NECK = 'M108.5,4 L115.5,4 L115.5,9 L108.5,9 Z';
const VIAL_CORK = 'M107.5,1 L116.5,1 L116.5,5 L107.5,5 Z';
const STRAP_A = 'M106,24 C104,36 101,48 99,60';
const STRAP_B = 'M118,24 C122,36 128,44 134,50';
// ⚠️ **I baffi partono dal muso e vanno avanti**, mai indietro verso l'occhio. Nella prima versione
// tornavano verso la guancia fino a x 164, cioè sotto l'occhio a 174, e a seconda della livrea
// leggevano come una ruga o uno strizzare: l'espressione cambiava da sola. Ora la punta più
// arretrata sta a x 186, dodici unità avanti all'occhio, e un test lo tiene.
const WHISKERS = [
  'M186,49 C192,47 198,45 204,44',
  'M187,52 C193,52 199,52 206,52',
  'M186,55 C192,57 198,59 203,61',
];

/**
 * La cornice, **misurata sui pixel dipinti** del ratto con tutto addosso — teschio e ampolla —
 * perché la cornice non cambia con l'allestimento: in uno sciame i ratti hanno tutti la stessa
 * scatola, e accendere un'ampolla non sposta niente. Il metodo è disegnare l'SVG su una tela a 4× e
 * cercare il primo e l'ultimo pixel non trasparente; né `getBBox()` né `getBoundingClientRect()`
 * servono, perché il tratto non lo contano.
 *
 * Misurato il 2026-09-18: da **9,75** (la punta della coda) a **229,5** (la punta del becco), da
 * **0** (il tappo dell'ampolla) a **88,25** (la pianta dei piedi, dopo il ridisegno delle zampe).
 * ⚠️ La prima cornice, scritta a occhio prima di misurare, finiva a 88 e **tagliava i piedi**.
 */
const VIEW_BOX = { x: 9, y: -1, width: 221, height: 90 } as const;
const RATIO = VIEW_BOX.width / VIEW_BOX.height;

export interface RatProps {
  /** Quale pelo. Il grigio è il ratto normale; il bianco e il marrone sono le varianti. */
  livery?: RatLivery;
  /**
   * L'altezza a cui disegnarlo, in pixel.
   *
   * ⚠️ **È l'altezza, come per {@link RatMascot}**: un ratto è lungo due volte e mezzo quanto è
   * alto, quindi «il lato» non vorrebbe dire niente. La lunghezza la porta il rapporto del disegno.
   */
  size?: number;
  /** Il teschio di corvo portato come elmo, col becco sul muso. */
  hasSkull?: boolean;
  /** L'ampolla di veleno legata sulle spalle. */
  hasVial?: boolean;
  /** Classi aggiuntive sull'`<svg>`. È da qui che passano l'alone della peste e il ribaltamento. */
  className?: string;
  /** Il nome con cui si annuncia. Senza, è **decorativo**. */
  title?: string;
}

/**
 * **Il ratto dei Ludoratti**, di profilo, che sa il fatto suo.
 *
 * Disegnato **da zero** il 2026-09-17 nella tecnica della mascotte con l'ampolla — contorno
 * d'inchiostro e campiture piatte — perché i due siano lo stesso personaggio. Rispetto al disegno
 * che veniva da RattInventario: un occhio solo (era di profilo con due occhi), l'orecchio sul cranio
 * e non sulla fronte, il muso che rastrema a punta, corpo e testa in una sagoma sola, la coda che
 * rastrema e sale, ogni zampa in un percorso solo con coscia e piede, i baffi in avanti, e il
 * sopracciglio.
 *
 * ⚠️ **Sta fermo, ed è il punto.** Le parti che si muovono portano un nome — `pb-rat-body`,
 * `pb-rat-tail`, `pb-rat-ears`, `pb-rat-leg-front`, `pb-rat-leg-back`, `pb-rat-vial` — e le regole
 * che le animano vivono in `animations.css`, agganciate a una classe che mette chi lo fa correre.
 * Qui dentro non c'è nessun `<style>`.
 *
 * ⚠️ **Le zampe stanno in due gruppi annidati apposta.** Quello fuori porta lo spostamento come
 * attributo — le zampe del lato lontano stanno più indietro — e quello dentro porta la classe: una
 * `transform` in CSS **sostituisce** l'attributo invece di sommarsi, quindi animare il gruppo che
 * ha già lo spostamento lo riporterebbe all'origine.
 *
 * ⚠️ **Guarda a destra.** Per farlo andare dall'altra parte si ribalta chi lo contiene con
 * `scale-x-[-1]`.
 */
export function Rat({
  livery = 'grey',
  size = 60,
  hasSkull = false,
  hasVial = false,
  className = '',
  title,
}: RatProps) {
  const c = RAT_LIVERIES[livery];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      width={Math.round(size * RATIO)}
      height={size}
      className={className}
      role={title === undefined ? undefined : 'img'}
      aria-hidden={title === undefined ? true : undefined}
      aria-label={title}
    >
      {title !== undefined && <title>{title}</title>}

      <g stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" strokeLinecap="round">
        <path className="pb-rat-tail" d={TAIL} fill={c.tail} />

        <g className="pb-rat-body">
          <path d={EAR_FAR} fill={c.ear} />

          {/* Le zampe del lato lontano: più scure, più indietro, e dietro a tutto. */}
          <g transform="translate(-13,0)">
            <g className="pb-rat-leg-back">
              <path d={LEG_BACK} fill={c.tail} />
            </g>
          </g>
          <g transform="translate(-11,0)">
            <g className="pb-rat-leg-front">
              <path d={LEG_FRONT} fill={c.tail} />
            </g>
          </g>

          <path d={BODY} fill={c.body} />

          {hasVial && (
            <>
              <path d={STRAP_A} fill="none" strokeWidth={STROKE + 0.2} />
              <path d={STRAP_B} fill="none" strokeWidth={STROKE + 0.2} />
            </>
          )}

          <g className="pb-rat-leg-back">
            <path d={LEG_BACK} fill={c.body} />
            <path d={PAD_BACK} fill={c.ear} stroke="none" />
          </g>
          <g className="pb-rat-leg-front">
            <path d={LEG_FRONT} fill={c.body} />
            <path d={PAD_FRONT} fill={c.ear} stroke="none" />
          </g>

          <g className="pb-rat-ears">
            <path d={EAR} fill={c.body} />
            <path d={EAR_INNER} fill={c.ear} strokeWidth={STROKE * 0.7} />
          </g>

          <ellipse cx="195" cy="52" rx="3.4" ry="2.8" fill={c.nose} strokeWidth={STROKE * 0.7} />

          {hasSkull && (
            <g className="pb-rat-skull">
              <path d={BEAK} fill={BONE_SHADE} />
              <path d={SKULL} fill={BONE} />
              <path d={SKULL_SOCKET} fill={INK} strokeWidth={STROKE * 0.6} />
              <path d={SKULL_NOSTRIL} fill="none" strokeWidth={STROKE * 0.7} />
            </g>
          )}

          {hasVial && (
            <g className="pb-rat-vial">
              <path d={VIAL_CORK} fill={CORK} strokeWidth={STROKE * 0.75} />
              <path d={VIAL_NECK} fill={GLASS} strokeWidth={STROKE * 0.75} />
              <circle cx={VIAL.cx} cy={VIAL.cy} r={VIAL.r} fill={GLASS} strokeWidth={STROKE * 0.85} />
              <path d={VIAL_LIQUID} fill={POISON} stroke="none" />
              <ellipse cx="108.5" cy="19.5" rx="1.6" ry="2.4" fill={POISON_LIGHT} stroke="none" />
            </g>
          )}

          <path d={BROW} fill="none" />
          {/* L'occhio prende il colore della livrea, non l'inchiostro: l'albino ce l'ha rosso, come
              la mascotte. Sul grigio e sul marrone la differenza dall'inchiostro non si vede. */}
          <circle cx="174" cy="42.5" r="3.8" fill={c.eye} stroke="none" />
          <circle cx="175.3" cy="41.2" r="1.3" fill="#ffffff" opacity="0.92" stroke="none" />

          <g className="pb-rat-whiskers" fill="none" strokeWidth={STROKE * 0.55} opacity="0.85">
            {WHISKERS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
