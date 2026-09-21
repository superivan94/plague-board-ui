import { IconBase } from './IconBase';
import type { IconProps } from './types';

/** La curva destra del cuore: sale dal vertice in basso, gira attorno al lobo e torna al centro. */
const HEART_RIGHT = 'M12 18.5C14.1667 17.5 16 15 17 13C17.5 11.5 16 10 15 9.5C14 9 12 10.5 12 10.5';

/**
 * La curva sinistra, speculare.
 *
 * ⚠️ Comincia con una `S`, che è una cubica il cui primo punto di controllo è il **riflesso** del
 * precedente. Dopo una `M` quel riflesso coincide col punto corrente — ed è la ragione per cui le
 * due curve si possono concatenare senza toccarle: in coda alla destra, il controllo precedente è
 * già (12 · 10,5), cioè lo stesso punto, e la `S` disegna esattamente quello che disegnava prima.
 */
const HEART_LEFT = 'M12 10.5S10 9 9 9.5C8 10 6.5 11.5 7 13C8 15 9.83333 17.5 12 18.5';

/**
 * Il cuore pieno: le **stesse due curve**, concatenate e chiuse.
 *
 * ⚠️ Non è un tracciato suo, ed è una scelta: un secondo disegno a mano si scollerebbe dal primo
 * al primo ritocco, e lo scarto — qualche decimo su 24 unità — a 18px non si vede e a 96 è un alone
 * lungo il bordo. Si costruisce da `HEART_RIGHT` e `HEART_LEFT` perché così un ritocco al contorno
 * arriva alla campitura da solo, e un test lo tiene.
 */
const HEART_FILL = `${HEART_RIGHT}${HEART_LEFT.replace('M12 10.5', '')}Z`;

/**
 * I due occhi, **cavati** dalla campitura.
 *
 * ⚠️ Cavati e non dipinti, e non è una preferenza: la campitura è `currentColor`, quindi un occhio
 * dello stesso colore sopra di lei non esiste. Stanno perciò nello stesso `d` del cuore, che passa
 * a `fill-rule="evenodd"` — la regola pari/dispari li conta come buchi perché sono **interamente
 * dentro** la sagoma. (Fosse una sagoma affiancata non funzionerebbe: là i bordi si contano
 * insieme.) Su un cuore pieno senza occhi `evenodd` e `nonzero` danno lo stesso disegno: misurato
 * il 2026-09-21 a 24, 96 e 512px, **zero** byte di differenza.
 *
 * La forma non è un triangolo esatto — l'utente l'ha disegnata a mano e chiesta così: un **cuneo**
 * con la punta in fuori e smussata, la testa interna tonda, i due bordi curvi. Una sonda a
 * componenti connesse ha riportato il disegno in unità del `viewBox`: occhi larghi 2,23 e alti
 * 1,57, con la **punta esterna più alta** della testa interna, che è il taglio felino. Il varco fra
 * le due teste è **2,10** — non 1,50 come nella prima stesura — perché è lui a decidere il
 * pavimento: a 24px 1,50 unità fanno un pixel e mezzo e l'antialiasing fonde i due segni in uno.
 */
const MUZZLE_EYE_LEFT =
  'M9.08 12.38Q9.77 13.23 10.71 13.67Q11.7 13.41 11.19 12.53Q10.21 12.18 9.12 12.3Q8.95 12.28 9.08 12.38Z';

/**
 * L'occhio destro è lo **specchio esatto** del sinistro: ogni `x` diventa `24 − x`.
 *
 * ⚠️ Si scrive così e non ricalcolando la geometria dal lato opposto, che è come era nato: con due
 * coordinate arrotondate a due decimali per conto proprio, i due occhi finivano a **0,04** di
 * distanza dalla simmetria — invisibile, e comunque una cosa che il primo ritocco a mano allarga.
 * Lo specchio inverte il verso del tracciato, che con `evenodd` non conta.
 */
const MUZZLE_EYE_RIGHT = MUZZLE_EYE_LEFT.replace(
  /(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,
  (_, x: string, y: string) => `${Number((24 - Number(x)).toFixed(2))} ${y}`,
);

const MUZZLE_EYES = `${MUZZLE_EYE_LEFT}${MUZZLE_EYE_RIGHT}`;

/**
 * I baffi: tre per lato, dritti, che **nascono dentro la sagoma** e ne escono.
 *
 * ⚠️ Nascono dentro apposta, ed è per questo che il tracciato va dipinto **prima** della
 * campitura: il cuore pieno copre il moncone interno, e non c'è nessuna intersezione fra retta e
 * curva da calcolare. È lo stesso mestiere del giunto sintetico dietro al tronco del ratto che
 * corre. Ne discende che i baffi esistono **solo da pieno**: sul cuore vuoto sarebbero sei
 * trattini che entrano nel niente.
 *
 * ⚠️ E i due di sotto sono **più corti** dei due di sopra per un motivo misurato, non per gusto:
 * col battito interno il gruppo scala 1,12 attorno a (12 · 13) mentre l'anello resta fermo, e
 * nella prima taratura le loro punte lo tagliavano al picco. Rientrate, i franchi sono 0,54 · 0,38
 * · 0,43 — e un test li ricontrolla, perché allungare un baffo è la modifica più innocua del mondo.
 */
const MUZZLE_WHISKERS =
  'M10.3 17.2L5.75 16.35M11 17.9L7 17.95M11.55 18.3L8.9 19.1' +
  'M13.7 17.2L18.25 16.35M13 17.9L17 17.95M12.45 18.3L15.1 19.1';

/** Il tratto dei baffi. Misurato sul disegno a mano: ~0,55; sopra 0,8 non sono baffi ma zampe. */
const MUZZLE_WHISKER_WIDTH = 0.45;

/** Lo stato del marchio: il cuore col solo contorno, o pieno. */
export type RatIconState = 'empty' | 'filled';

/**
 * Quanto muso mostra lo stato pieno: niente, i soli occhi, o occhi e baffi.
 *
 * È la terza lettura del marchio portata a galla — il muso del ratto — e si accende a mano perché
 * ognuno dei tre gradini ha una **misura minima diversa**: vedi {@link RAT_ICON_MUZZLE_FLOOR}.
 */
export type RatIconMuzzle = 'none' | 'eyes' | 'full';

/**
 * La misura sotto la quale ogni gradino del muso smette di dire quello che disegna.
 *
 * Misurati il 2026-09-21 sui pixel veri, ingranditi col vicino più prossimo: a **18px** i due occhi
 * si fondono in una fascia sola e il cuore sembra scheggiato; a **24** diventano due occhi ma i
 * baffi sono tratteggi; a **32** i baffi sono baffi. Il 18 del gradino `none` è il pavimento
 * storico del marchio, ed è la misura che usa la barra compatta.
 *
 * ⚠️ **La tabella esiste perché il componente non può decidere da sé.** Una classe `size-*`
 * sostituisce l'attributo `width` di un `<svg>` — misurato su questa stessa barra — quindi `size`
 * non è un testimone attendibile di quanto il segno verrà dipinto davvero. La libreria dà il
 * numero, la scelta la fa chi monta: è la stessa divisione di `PLAGUE_BAR_MARK_SIZE` e della sua
 * tabella di classi.
 */
export const RAT_ICON_MUZZLE_FLOOR: Record<RatIconMuzzle, number> = {
  none: 18,
  eyes: 24,
  full: 32,
};

/**
 * Che cosa batte.
 *
 * `'whole'` è il marchio intero, anello compreso, ed è quello che ha sempre fatto in
 * un'intestazione; `'inner'` tiene fermo l'anello — che è il recinto, non il soggetto — e fa
 * battere il cuore dentro di lui.
 */
export type RatIconBeat = 'whole' | 'inner';

export interface RatIconProps extends IconProps {
  /**
   * Il cuore **pieno** invece che col solo contorno.
   *
   * ⚠️ Il contorno resta in tutti e due gli stati: il tratto dipinge mezza unità oltre il
   * percorso, quindi togliendolo il cuore pieno sarebbe più magro di quello vuoto e i due stati si
   * vedrebbero cambiare **taglia** invece che riempirsi.
   */
  isFilled?: boolean;
  /**
   * In quale stato batte. Senza, batte in tutti e due.
   *
   * `'filled'` e `'empty'` servono dove il marchio è un **comando a due stati** — i preferiti — e
   * il battito deve dire qualcosa: su quello scelto se si vuole che si veda, su quello da scegliere
   * se si vuole che chiami. `'none'` lo ferma, e va usato dove il marchio sta dentro qualcosa che
   * si legge: una tabella di misure con un cuore che pulsa dentro fa muovere i numeri.
   */
  animateOn?: RatIconState | 'both' | 'none';
  /**
   * Che cosa batte: tutto il marchio, o il solo cuore dentro un anello fermo.
   *
   * ⚠️ Il predefinito è `'whole'` perché è quello che il marchio faceva già prima che il battito
   * entrasse nel componente — l'intestazione gli passava `animate-heartbeat` addosso all'`<svg>`
   * intero. Cambiarlo vorrebbe dire modificare l'aspetto di ogni marchio già montato senza che
   * nessuno l'abbia chiesto. `'inner'` è la variante di regia: alle misure grandi l'anello fermo
   * dà un riferimento immobile e il battito si legge meglio.
   */
  beat?: RatIconBeat;
  /**
   * Quanto **muso** mostra lo stato pieno: niente, i soli occhi, o occhi e baffi.
   *
   * ⚠️ Descrive lo stato **pieno**, non il marchio: sul cuore vuoto non c'è campitura in cui cavare
   * gli occhi né che copra la radice dei baffi, quindi non compare niente. Non è una prop ignorata
   * — è la stessa forma di `animateOn: 'filled'`, che dice in quale dei due stati si batte.
   *
   * ⚠️ Il predefinito è `'none'` perché il marchio è già montato in una barra, in un piede e in una
   * schermata di accesso: un muso comparso da sé cambierebbe l'identità di tutti e tre senza che
   * nessuno l'abbia chiesto. E ogni gradino ha la sua misura minima, in
   * {@link RAT_ICON_MUZZLE_FLOOR}.
   */
  muzzle?: RatIconMuzzle;
}

/**
 * **Il marchio dei Ludoratti.** Un anello, due orecchie tonde in alto, e sotto due curve che si
 * incontrano in punta.
 *
 * ⚠️ **Si legge in tre modi, e sono tutti e tre voluti** — è il segno principale del racconto, non
 * un'icona decorativa:
 *
 * 1. a prima vista è un **cuore**, cioè la salvezza;
 * 2. guardandolo meglio sono **due figure che si abbracciano**;
 * 3. ma le due orecchie dicono la verità: è il **muso di un ratto**.
 *
 * Da qui discendono i suoi **due mestieri**, e sono due davvero. È il **marchio**, e sta dove parla
 * la corporazione: una barra, una schermata di accesso, un piede. Ed è il **cuore**, cioè il
 * comando dei preferiti — la prima delle tre letture vale quanto la terza, e `isFilled` è lì per
 * quella. ⚠️ Quello che non fa è **prestarsi come glifo di un'altra cosa**: per dire «peste» c'è
 * {@link BiohazardIcon}, per dire «gioco» il dado. Un segno che dice tutto smette di dire qualcosa,
 * e la regola è quella — non «il marchio non si tocca», ma «il marchio dice quello che disegna».
 *
 * ⚠️ **I due stati escono dalla prima lettura, non da una deroga.** Un cuore vuoto e un cuore pieno
 * sono la convenzione con cui il software dice «non l'ho scelto / l'ho scelto»: `isFilled` rende il
 * marchio anche il comando dei **preferiti**, senza che serva un secondo disegno — e senza che
 * smetta di essere il marchio, perché quello che gli si chiede di dire lì è quello che già disegna.
 *
 * ⚠️ **Batte da sé, e questa è una deroga dichiarata.** La regola della tazza e del pallino dice
 * che l'interruttore di un'animazione sta su chi monta il pezzo, non dentro il disegno; qui è il
 * contrario, perché il battito del marchio è **identità** e non decorazione, e chi lo monta non
 * deve ricordarsi di accenderlo. Chi non lo vuole ha `animateOn`. ⚠️ E chi ha chiesto meno
 * movimento lo ottiene comunque, dalla regola in fondo ad `animations.css`.
 *
 * ⚠️ **A battere è tutto il marchio, o il solo cuore**: lo dice `beat`. Il predefinito è il primo,
 * che è quello che il segno ha sempre fatto; col secondo l'anello resta fermo e fa da recinto, e
 * alle misure grandi è lui a far leggere meglio il battito — un riferimento immobile accanto a una
 * cosa che si muove.
 *
 * ⚠️ **Non è il ratto che attraversa la pagina.** Quello è un personaggio disegnato, con la livrea
 * e la coda, e vive altrove: qui c'è un emblema, fatto per essere riconosciuto a 18px.
 *
 * Il disegno arriva invariato da `ludoratti.it`, dove sta sopra il nome.
 *
 * @example
 * ```tsx
 * <RatIcon size={28} />                                   // il marchio, che batte tutto insieme
 * <RatIcon size={96} beat="inner" />                      // grande: l'anello fermo, il cuore batte
 * <RatIcon isFilled animateOn="filled" />                 // un preferito scelto, che si vede
 * <RatIcon size={16} animateOn="none" />                  // dentro una tabella, fermo
 * ```
 */
export function RatIcon({
  isFilled = false,
  animateOn = 'both',
  beat = 'whole',
  muzzle = 'none',
  className = '',
  ...props
}: RatIconProps) {
  const state: RatIconState = isFilled ? 'filled' : 'empty';
  const beats = animateOn === 'both' || animateOn === state;
  // Il muso vive nella campitura: senza di lei non c'è dove cavare gli occhi né cosa copra la
  // radice dei baffi.
  const face = isFilled ? muzzle : 'none';

  // ⚠️ La variante intera scrive sullo stesso attributo che riceve `className`: si **compone**, o
  // un marchio che batte perde il colore e lo `shrink-0` che gli ha dato chi lo mette in una barra.
  const svgClass = beats && beat === 'whole' ? `pb-mark-beat ${className}`.trim() : className;
  const innerClass = beats && beat === 'inner' ? 'pb-mark-beat pb-mark-beat--inner' : undefined;

  return (
    <IconBase {...props} className={svgClass} paint="stroke">
      {/* L'anello che contiene tutto. Tenue: è il recinto, non il soggetto — e per questo resta
          fuori dal gruppo che batte. */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <g className={innerClass}>
        {/* I baffi **prima** della campitura: nascono dentro la sagoma e il cuore pieno ne copre
            la radice, così non c'è nessuna intersezione da calcolare. Invertendo l'ordine, da
            ogni baffo spunterebbe un mozzicone in mezzo al muso. */}
        {face === 'full' ? (
          <path
            d={MUZZLE_WHISKERS}
            strokeWidth={MUZZLE_WHISKER_WIDTH}
            strokeLinecap="round"
          />
        ) : null}
        {/* La campitura sta **sotto** il contorno, o il tratto tondo dei capi si vedrebbe tagliato
            dal bordo netto del riempimento. Gli occhi sono nel suo stesso `d`, cavati da
            `evenodd`: su un cuore senza occhi quella regola non cambia un pixel. */}
        {isFilled ? (
          <path
            d={face === 'none' ? HEART_FILL : `${HEART_FILL}${MUZZLE_EYES}`}
            fill="currentColor"
            fillRule="evenodd"
            stroke="none"
          />
        ) : null}
        {/* Le due curve che formano il cuore, l'abbraccio e il muso. Si incontrano in alto al
            centro e scendono a chiudersi in punta. */}
        <path d={HEART_RIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={HEART_LEFT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Le orecchie: sono l'unico pieno del disegno vuoto, e sono la cosa che rivela il ratto. */}
        <circle cx="14.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </IconBase>
  );
}
