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

/** Lo stato del marchio: il cuore col solo contorno, o pieno. */
export type RatIconState = 'empty' | 'filled';

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
 * Da qui discende come si usa. È il marchio: sta dove parla la corporazione — una barra, una
 * schermata di accesso, un piede — e **non si usa come icona di dominio**. Per dire «peste» c'è
 * {@link BiohazardIcon}, per dire «gioco» il dado: un marchio che marca anche le cose smette di
 * marcare sé stesso.
 *
 * ⚠️ **Ha due stati, e la prima lettura è quella che glieli dà.** Un cuore vuoto e un cuore pieno
 * sono la convenzione con cui il software dice «non l'ho scelto / l'ho scelto»: `isFilled` rende il
 * marchio anche il comando dei **preferiti**, senza che serva un secondo disegno. È l'unico posto
 * in cui questo segno esce dal mestiere di marchio, e ci esce perché lì continua a dire la stessa
 * cosa — qualcosa a cui si tiene.
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
  className = '',
  ...props
}: RatIconProps) {
  const state: RatIconState = isFilled ? 'filled' : 'empty';
  const beats = animateOn === 'both' || animateOn === state;

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
        {/* La campitura sta **sotto** il contorno, o il tratto tondo dei capi si vedrebbe tagliato
            dal bordo netto del riempimento. */}
        {isFilled ? <path d={HEART_FILL} fill="currentColor" stroke="none" /> : null}
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
